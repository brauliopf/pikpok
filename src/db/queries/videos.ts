import { db } from "..";
import { videos } from "../schema";
import { desc, sql } from "drizzle-orm";
import { VideoIdToS3Key, VideoIDKey } from "@/types";
import { getUser } from "./users";
import { queryRedisDB } from "@/app/actions";

export async function getRecommendedFromRedis(
  clerk_id: string | null
): Promise<{ video_id: string; score: number }[] | null> {
  let user;
  let recs = null;
  if (clerk_id) {
    user = await getUser(clerk_id);
    recs = await queryRedisDB(`recommendations:${user.id}`);
  } else {
    recs = await queryRedisDB(`recommendations:guest`);
  }
  return recs;
}

export async function getRecommendedVideos(
  clerk_id: string | null
): Promise<any> {
  const recs = await getRecommendedFromRedis(clerk_id);

  const sql_query = sql`
    SELECT v.id, v.s3_key, v.user_id, c.profile_image_url
    FROM videos AS v
    INNER JOIN users AS c ON v.user_id = c.id
    WHERE
      v.id IN ${recs!.map((r) => r.video_id)}
  `;

  const sql_result = await db.execute(sql_query);

  const getScoreFromVideoId = (
    data: { video_id: string; score: number }[],
    video_id: string
  ): number | undefined => {
    const item = data.find((item) => item.video_id == video_id);
    return item?.score || undefined;
  };

  const recommended = sql_result.rows.map((row) => ({
    ...row,
    score: getScoreFromVideoId(recs!, row.id as string),
  }));

  const ranked_recs = recommended.sort((a, b) => b.score! - a.score!);

  return ranked_recs;
}

export async function getCustomVideos({
  clerk_id,
  limit,
  offset,
}: {
  clerk_id: string | null;
  limit: number;
  offset: number;
}): Promise<{
  data: VideoIdToS3Key[];
}> {
  let sql_query = sql``;
  if (clerk_id) {
    sql_query = sql`
    WITH user_data AS (
      SELECT embeddings
      FROM users WHERE clerk_id = ${clerk_id}
    )
    SELECT v.id, v.s3_key, 1 - (v.embeddings <=> u.embeddings) AS similarity, creator.profile_image_url AS creator_img, creator.id  AS creator_id
    FROM videos AS v
    LEFT JOIN user_data AS u ON true
    LEFT JOIN users AS creator ON creator.id = v.user_id
    ORDER BY 3 DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  } else {
    sql_query = sql`
    SELECT v.id, v.s3_key, 0.1 AS similarity, creator.profile_image_url AS creator_img, creator.id  AS creator_id
    FROM videos AS v
    LEFT JOIN users AS creator ON creator.id = v.user_id
    ORDER BY 3 DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  }
  const sql_result = await db.execute(sql_query);

  const results = sql_result.rows.map(
    (
      row
    ): {
      id: string;
      s3_key: string;
      similarity: number;
      creator_img: string;
      creator_id: string;
    } => ({
      id: row.id as string,
      s3_key: row.s3_key as string,
      similarity: row.similarity as number,
      creator_img: row.creator_img as string,
      creator_id: row.creator_id as string,
    })
  );

  return { data: results };
}

export async function getVideosGuest(): Promise<VideoIDKey[]> {
  // ref: https://orm.drizzle.team/docs/select
  const result = await db
    .select({
      id: videos.id,
      s3Key: videos.s3Key,
      title: videos.title,
      status: videos.status,
    })
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(40);
  return result;
}

/**
 * return: id, s3Key, title, status
 */
export async function getVideos({
  limit,
  offset = 0,
}: {
  limit: number;
  offset: number;
}): Promise<{
  status: number;
  data: VideoIDKey[];
}> {
  // ref: https://orm.drizzle.team/docs/select
  const result = await db
    .select({
      id: videos.id,
      s3Key: videos.s3Key,
      title: videos.title,
      status: videos.status,
    })
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
  return { status: 200, data: result as VideoIDKey[] };
}

export async function getRecommendedVideos_Backup({
  clerk_id,
  limit,
  offset,
}: {
  clerk_id: string | null;
  limit: number;
  offset: number;
}): Promise<{
  data: VideoIdToS3Key[];
}> {
  let sql_query = sql``;
  if (clerk_id) {
    sql_query = sql`
    WITH user_data AS (
      SELECT id, embeddings
      FROM users WHERE clerk_id = ${clerk_id}
    ),
    -- get user likes
    user_likes AS (SELECT videoId FROM likes WHERE user_id = user_data.id)
    -- tag likes to simplify counting
    tagged_likes AS (SELECT *, CASE WHEN video_id IN (SELECT videoId FROM user_likes) THEN 1 ELSE 0 END AS user_like)
    -- count tagged likes (of tagged videos) and rank users
    ref_users AS (SELECT user_id, COUNT(*) GROUP BY user_id AS counter FROM tagged_likes WHERE user_like = 1 ORDER BY counter DESC limit 3)
    -- select
    SELECT * from ref_users

    -- mark videos that ref liked as 1 + prioritize them (order by)
    SELECT v.id, v.s3_key, 1 - (v.embeddings <=> u.embeddings) AS similarity, creator.profile_image_url AS creator_img, creator.id  AS creator_id
    FROM videos AS v
    LEFT JOIN user_data AS u ON true
    LEFT JOIN users AS creator ON creator.id = v.user_id
    ORDER BY 3 DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  } else {
    sql_query = sql`
    SELECT v.id, v.s3_key, 0.1 AS similarity, creator.profile_image_url AS creator_img, creator.id  AS creator_id
    FROM videos AS v
    LEFT JOIN users AS creator ON creator.id = v.user_id
    ORDER BY 3 DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  }
  const sql_result = await db.execute(sql_query);

  const results = sql_result.rows.map(
    (
      row
    ): {
      id: string;
      s3_key: string;
      similarity: number;
      creator_img: string;
      creator_id: string;
    } => ({
      id: row.id as string,
      s3_key: row.s3_key as string,
      similarity: row.similarity as number,
      creator_img: row.creator_img as string,
      creator_id: row.creator_id as string,
    })
  );

  return { data: results };
}
