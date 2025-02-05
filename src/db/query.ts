import { db } from ".";
import { videos } from "./schema";
import { type InferSelectModel, asc, desc } from "drizzle-orm";

type SelectVideo = InferSelectModel<typeof videos>;

export async function getVideos({
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
