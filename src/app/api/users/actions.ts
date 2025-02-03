import { db } from "../../../db";
import { users } from "../../../db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;

export async function getUsers(): Promise<SelectUser[]> {
  const allUsers = await db.select().from(users);
  return allUsers;
}

export async function createUser(data: InsertUser): Promise<{
  status: number;
  data: SelectUser;
}> {
  const result = await db.insert(users).values(data).execute();
  const newUser = result.rows[0];
  return { status: 200, data: newUser };
}
