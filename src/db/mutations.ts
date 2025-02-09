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
