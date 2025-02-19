import json
import os
import datetime
import math
import numpy as np
import pandas as pd
import psycopg2
from fastapi import FastAPI
import uvicorn
from upstash_redis import Redis
from sklearn.metrics.pairwise import cosine_similarity

# Load environment variables
from dotenv import load_dotenv
load_dotenv(".env.py")

# ----------------------------------------------------------------
# 1. Connect to Database & Redis
# ----------------------------------------------------------------

# Connect to PostgreSQL
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# Connect to Redis
redis = Redis(url=os.getenv("UPSTASH_REDIS_URL"), token=os.getenv("UPSTASH_REDIS_TOKEN"))

# ----------------------------------------------------------------
#  2. Create feed based on similarity only
# ----------------------------------------------------------------

def get_similarity_scores(target_vector, comparison_vectors):
  """
  gets cosine similarity to a target vector
  
  Parameters:
  user_embedding: array-like of shape (1, n_features) --The reference vector for comparison
  videos_embedding: array-like of shape (1:video_id + n_samples, n_features) --The vectors to compare against the target
      
  Returns:
  list of tuples: (video_id, similarity_score)
  """

  # Cast input to arrays for easy manipulation
  # json.loads takes a stringified json! '[....]'
  target_vector_json = json.loads(target_vector)
  target_vector_arr = np.array(target_vector_json).reshape(1, -1) # cast as array with 1 row and any numbrer of columns (-1)

  # extract video_id
  video_ids = [comp[0] for comp in comparison_vectors]

  # extract videos embeddings
  comparison_vectors_json = [json.loads(comp[1]) for comp in comparison_vectors]
  comparison_vectors_arr = np.array(comparison_vectors_json)

  # Calculate cosine similarities
  similarities = cosine_similarity(target_vector_arr, comparison_vectors_arr)[0] # one row per row of the target

  map_video_score = list(zip(video_ids, similarities))

  return map_video_score

def generate_recommendations_from_profile():
  """
  Takes no input. Select all users and, for each, get a listing of video_ids ranked by decreasing cosine similarity to the profile embedding.
  Returns a list of tuples (vid, score) with shape (#users, #videos)
  """
  # get users and profile embeddings
  cursor.execute("SELECT id, embeddings FROM users")
  user_ids =  cursor.fetchall()

  # get all video embeddings
  # TODO: handle no user logged in (guest)
  # TODO: handle video embeddings is NULL
  cursor.execute("SELECT id, embeddings FROM videos WHERE embeddings IS NOT NULL")
  videos_embedding = cursor.fetchall() # (#videos, #embeddings + 1)

  # for each user: rank cosine similarity with existing videos --videos.embeddings
  map_user_ranked_similarities = {}
  # user_ids: [(id, embedding)]
  for user_id, user_embedding in user_ids:
      # map video_id to scores
      map_video_scores = get_similarity_scores(user_embedding, videos_embedding)
      # rank scores
      ranked_scores = sorted(map_video_scores, key = lambda x: x[1], reverse=True)
      # returned ranked list
      map_user_ranked_similarities[user_id] = ranked_scores

      print(f"Similarity scores for user {user_id}: {[f'{tup[1]:.2f}' for tup in map_user_ranked_similarities[user_id]]}")
  
  return map_user_ranked_similarities

# ----------------------------------------------------------------
# 2️⃣ Fetch user-video interactions from PostgreSQL
# ----------------------------------------------------------------

def fetch_user_interactions():
    """Fetch user interactions (likes, watch time) from PostgreSQL."""
    cursor.execute("""
        SELECT first_name
        FROM users
    """)
    return cursor.fetchall()


# ----------------------------------------------------------------
# 3️⃣ Apply Time Decay
# ----------------------------------------------------------------

def apply_time_decay(interaction_score, interaction_time, decay_rate=0.01):
    """
    Apply time decay to older interactions.
    - Newer interactions have a higher impact.
    - Older interactions get lower scores.
    """
    current_time = datetime.now()
    time_diff = (current_time - interaction_time).days  # Time difference in days
    decay_weight = math.exp(-decay_rate * time_diff)  # Apply exponential decay
    return interaction_score * decay_weight  # Adjusted score


# ----------------------------------------------------------------
# 4️⃣ Compute User Ratings
# ----------------------------------------------------------------

def compute_rating(interaction, watch_time, interaction_time):
    """
    Convert user interactions into a rating score.
    - Likes = 5.0 (Maximum score)
    - Watch time is scaled to a 0-3 range.
    - Time decay is applied to older interactions.
    """
    if interaction == 'like':
        base_score = 5.0
    else:
        base_score = min((watch_time / 30) * 3, 3.0)  # Scale watch time to [0,3]

    return apply_time_decay(base_score, interaction_time)  # Apply time decay


# ----------------------------------------------------------------
# 5️⃣ Predict Ratings using Collaborative Filtering
# ----------------------------------------------------------------

def predict_rating(user_id, target_video_id, user_video_matrix, similarity_df, k=3):
    """
    Predict a user's rating for a target video using item-based collaborative filtering.
    """
    user_ratings = user_video_matrix.loc[user_id]
    sim_scores = similarity_df[target_video_id]

    rated_videos = user_ratings[user_ratings > 0].index
    rated_videos = rated_videos[rated_videos != target_video_id]

    sim_scores_for_rated = sim_scores[rated_videos].sort_values(ascending=False)
    top_videos = sim_scores_for_rated.head(k).index
    top_similarities = sim_scores_for_rated.head(k).values
    top_ratings = user_ratings[top_videos].values

    numerator = np.dot(top_similarities, top_ratings)
    denominator = np.sum(top_similarities)

    return numerator / denominator if denominator != 0 else 0.0

# ----------------------------------------------------------------
# 6️⃣ Generate Recommendations
# ----------------------------------------------------------------

def get_recommendations_for_user(user_id, user_video_matrix, similarity_df, k=3, top_n=5):
    """
    Get top-N video recommendations for a user.
    """
    user_ratings = user_video_matrix.loc[user_id]
    videos_not_rated = user_ratings[user_ratings == 0].index  # Get videos the user has NOT rated

    predictions = []
    for video_id in videos_not_rated:
        predicted_score = predict_rating(user_id, video_id, user_video_matrix, similarity_df, k=k)
        predictions.append((video_id, predicted_score))

    predictions.sort(key=lambda x: x[1], reverse=True)  # Sort by predicted score
    return predictions[:top_n]

# ----------------------------------------------------------------
# 7️⃣ Main Function to Generate Recommendations
# ----------------------------------------------------------------

def generate_recommendations():
    """
    Fetch interactions, compute ratings, generate recommendations, and store in Redis.
    """
    try:
        interactions = fetch_user_interactions()

        df = pd.DataFrame(interactions, columns=['User ID', 'Video ID', 'Interaction', 'Watch Time', 'Timestamp'])

        df['Rating'] = df.apply(
            lambda row: compute_rating(row['Interaction'], row['Watch Time'], row['Timestamp']),
            axis=1
        )

        user_video_matrix = df.pivot_table(index='User ID', columns='Video ID', values='Rating', aggfunc='mean') \
            .fillna(0)

        matrix_values = user_video_matrix.values
        video_similarity = cosine_similarity(matrix_values.T)  # Compute item-based similarity

        video_ids = user_video_matrix.columns
        similarity_df = pd.DataFrame(video_similarity, index=video_ids, columns=video_ids)

        all_users = user_video_matrix.index
        for user in all_users:
            recs = get_recommendations_for_user(user, user_video_matrix, similarity_df, k=5, top_n=5)
            store_recommendations_in_redis(user, recs)

        print("[INFO] Successfully generated & stored recommendations.")

    except Exception as e:
        print("[ERROR] generate_recommendations failed:", e)

# ----------------------------------------------------------------
# 8️⃣ Store Recommendations in Redis
# ----------------------------------------------------------------

def store_recommendations_in_redis(user_id, recs):
    """
    Store recommendations in Redis for fast retrieval
    """
    data = [{"video_id": vid, "score": float(score)} for (vid, score) in recs] 
    key = f"recommendations:{user_id}"
    redis.set(key, json.dumps(data, indent=2))
    print(f"[DEBUG] Stored recommendations for user {user_id} in Redis under key '{key}'.")

# ----------------------------------------------------------------
# Main Execution
# ----------------------------------------------------------------

app = FastAPI()

@app.get("/recommendations")
def generate_recommendations() -> None:
    try:
        # simple recommendartion system: based on similarity between user profile and video auto-generated description
        # get similarity scores
        map_user_scores = generate_recommendations_from_profile()
        # save scores to redis
        for user_id, video_scores in map_user_scores.items():
            store_recommendations_in_redis(user_id, video_scores)
    except Exception as e:
        print("Failed to gennerate recommendations: {e}")  # Print the error message
    pass        

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")