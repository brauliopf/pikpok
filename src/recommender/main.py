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

# Connect to PostgreSQL
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# Connect to Redis
redis = Redis(url=os.getenv("UPSTASH_REDIS_URL"), token=os.getenv("UPSTASH_REDIS_TOKEN"))

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
      # return ranked list
      map_user_ranked_similarities[user_id] = ranked_scores

      print(f"Similarity scores for user {user_id}: {[f'{tup[1]:.2f}' for tup in map_user_ranked_similarities[user_id]]}")
  
  return map_user_ranked_similarities

def store_recommendations_in_redis(user_id, recs):
    """
    Store recommendations in Redis for fast retrieval
    """
    data = [{"video_id": vid, "score": float(score)} for (vid, score) in recs] 
    key = f"recommendations:{user_id}"
    redis.set(key, json.dumps(data, indent=2))
    print(f"[DEBUG] Stored recommendations for user {user_id} in Redis under key '{key}'.")

app = FastAPI()

@app.get("/recommendations", status_code=201)
def generate_recommendations() -> None:
    try:
        # simple recommendartion system: based on similarity between user profile and video auto-generated description
        # get similarity scores
        map_user_scores = generate_recommendations_from_profile()
        # save scores to redis
        for user_id, video_scores in map_user_scores.items():
            store_recommendations_in_redis(user_id, video_scores)
    except Exception as e:
        print(f"Failed to generate recommendations: {e}")  # Print the error message
    return {"status": 200, "data": len(map_user_scores)}        

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, log_level="info")