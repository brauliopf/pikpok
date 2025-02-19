import { db } from "..";
import { users } from "../schema";
import { eq, type InferSelectModel } from "drizzle-orm";

type SelectUser = InferSelectModel<typeof users>;

export async function getUser(clerk_id: string): Promise<SelectUser> {
  // ref: https://orm.drizzle.team/docs/select
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerk_id, clerk_id))
    .limit(1)
    .execute();
  return result[0];
}
