import { db } from "..";
import { users, videos } from "../schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type SelectVideo = InferSelectModel<typeof videos>;
type InsertVideo = InferInsertModel<typeof videos>;

type VideoWithoutUserId = Omit<InsertVideo, "userId"> & { clerkId: string };

export async function createVideo(data: VideoWithoutUserId): Promise<{
  status: number;
  data: SelectVideo;
}> {
  // find user with select clerkId
  const query_res = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerk_id, data.clerkId))
    .execute();
  const upUser = query_res[0];

  // insert video passing the user real id
  const { title, s3Key } = data;
  const result = await db
    .insert(videos)
    .values({ title, s3Key, userId: upUser.id })
    .returning()
    .execute();
  const newVideo = result[0];
  return { status: 200, data: newVideo };
}

interface UpdateVideoMetadataParams {
  id: string;
  summary: string;
  interests: string[];
  embeddings?: number[] | [];
}

export async function updateVideoMetadata({
  id,
  summary,
  interests,
  embeddings,
}: UpdateVideoMetadataParams) {
  const result = await db
    .update(videos)
    .set({
      aisummary: summary,
      interests: JSON.stringify(interests),
      embeddings: embeddings,
    })
    .where(eq(videos.id, id));
  return { status: 200, data: result };
}
