import { db } from "..";
import { users } from "../schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;

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
