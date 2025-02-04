// import { db } from ".";
// import { users, videos } from "./schema";
// import { type InferSelectModel } from "drizzle-orm";

// type SelectUser = InferSelectModel<typeof users>;

// export async function getUsers(data: SelectUser[]): Promise<{
//   status: number;
//   data: SelectUser[];
// }> {
//   const result = await db.select(users).execute();
//   const newUser = result.rows[0];
//   return { status: 200, data: newUser };
// }
