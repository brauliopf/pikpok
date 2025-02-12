import { db } from ".";
import { users, videos } from "./schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;

type SelectVideo = InferSelectModel<typeof videos>;
type InsertVideo = InferInsertModel<typeof videos>;

export async function createUser(data: InsertUser): Promise<{
  status: number;
  data: SelectUser;
}> {
  const result = await db.insert(users).values(data).returning().execute();
  const newUser = result[0];
  return { status: 200, data: newUser };
}

export async function updateUser(
  data: Partial<InsertUser> & { clerk_id: string }
): Promise<{
  status: number;
  data: SelectUser;
}> {
  if (!data.clerk_id) {
    throw new Error("clerk_id is required");
  }

  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.clerk_id, data.clerk_id))
    .returning();
  const newUser = result[0];
  return { status: 200, data: newUser };
}

type VideoWithoutUserId = Omit<InsertVideo, "userId"> & { clerkId: string };

export async function createVideo(data: VideoWithoutUserId): Promise<{
  status: number;
  data: SelectVideo;
}> {
  // find user with select clerkId
  const query_res = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerk_id, data.clerkId));
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
