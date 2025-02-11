import { db } from ".";
import { videos } from "./schema";
import { desc } from "drizzle-orm";
import { VideoIDKey } from "@/types/video";

export async function getVideosS3Key({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<{
  status: number;
  data: { s3Key: string }[];
}> {
  // ref: https://orm.drizzle.team/docs/select
  const result = await db
    .select({ s3Key: videos.s3Key })
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
  return { status: 200, data: result };
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
