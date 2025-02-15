import { db } from "..";
import { sql } from "drizzle-orm";

export async function toggleLike({
  clerkId,
  videoId,
}: {
  clerkId: string;
  videoId: string;
}) {
  try {
    // try to update like
    // get user
    const sql_query = sql`
      WITH user_info AS (
        SELECT id 
        FROM users 
        WHERE clerk_id = ${clerkId}
      )
      UPDATE likes l
      SET revoked_at = NOW()
      FROM user_info u
      WHERE l.user_id = u.id 
        AND l.video_id = ${videoId}
        AND l.revoked_at IS NULL;
    `;
    const sql_result = await db.execute(sql_query);

    if (sql_result.rowCount == 0) {
      throw Error("like_not_found");
    }

    console.log("toggleLike", sql_result);
  } catch (err) {
    // if error === can't find lke, then create it
    if (err instanceof Error) {
      const sql_query = sql`
        WITH user_info AS (
          SELECT id 
          FROM users 
          WHERE clerk_id = ${clerkId}
        )
        INSERT INTO likes (user_id, video_id)
        SELECT
          user_info.id,
          ${videoId}
        FROM user_info
      `;
      const sql_result = await db.execute(sql_query);

      if (sql_result.rowCount == 0) {
        throw Error("like not created");
      }
    }
  }
  // TODO: do not return false
  return false;
}
