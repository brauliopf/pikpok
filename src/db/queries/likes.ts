import { db } from "..";
import { sql } from "drizzle-orm";
import { SelectLikes } from "@/types";

export const getUserLikes = async ({
  clerkId,
}: {
  clerkId?: string;
}): Promise<SelectLikes[]> => {
  const sql_query = sql`
        WITH user_info AS (
          SELECT id 
          FROM users 
          WHERE
           clerk_id = ${clerkId}
        )
        SELECT
          *
        FROM likes
        INNER JOIN user_info ON likes.user_id = user_info.id
        WHERE
          likes.user_id = user_info.id
          AND likes.revoked_at IS NULL
      `;
  const sql_result = await db.execute(sql_query);

  return sql_result.rows.map((row) => ({
    id: row.id as string,
    createdAt: row.createdAt as Date | null,
    revokedAt: row.revokedAt as Date | null,
    userId: row.user_id as string,
    videoId: row.video_id as string,
  }));
};
