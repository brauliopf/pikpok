import { db } from "..";
import { videos } from "../schema";
import { desc, sql } from "drizzle-orm";
import { VideoIDKey } from "@/types/video";
import { VideoIdToS3Key } from "@/types/video";

export async function getCustomVideos({
  clerk_id,
  limit,
  offset,
}: {
  clerk_id: string | null;
  limit: number;
  offset: number;
}): Promise<{
  status: number;
  data: VideoIdToS3Key[];
  timestamp: number;
}> {
  const sql_result = await db.execute(sql`
    WITH user_data AS (
      SELECT embeddings
      FROM users WHERE clerk_id = ${clerk_id}
    )
    SELECT id, s3_key, 1 - (v.embeddings <=> u.embeddings) AS similarity
    FROM videos AS v
    LEFT JOIN user_data AS u ON true
    ORDER BY 3 DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);

  const results = sql_result.rows.map(
    (row): { id: string; s3Key: string; similarity: number } => ({
      id: row.id as string,
      s3Key: row.s3Key as string,
      similarity: row.similarity as number,
    })
  );

  return { status: 200, data: results, timestamp: Date.now() };
}

/**
 * select videos to display
 * takes limit and offset only and return array of dicts with 2 keys: id, s3Key
 * *** must handle customization!
 */
export async function mapVideoIdToS3Key({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<{
  status: number;
  data: VideoIdToS3Key[];
  timestamp: number;
}> {
  // ref: https://orm.drizzle.team/docs/select
  const result = await db
    .select({ id: videos.id, s3Key: videos.s3Key })
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
  return { status: 200, data: result, timestamp: Date.now() };
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
