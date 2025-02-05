import { db } from ".";
import { videos } from "./schema";
import { type InferSelectModel } from "drizzle-orm";

type SelectVideo = InferSelectModel<typeof videos>;

export async function getVideos(): Promise<{
  status: number;
  data: { s3Key: string }[];
}> {
  const result = await db.select({ s3Key: videos.s3Key }).from(videos);
  return { status: 200, data: result };
}
