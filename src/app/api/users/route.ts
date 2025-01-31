import sql from "../../../lib/db";

// Example: Fetching users
import { db } from "../../../db";
import { Playing_with_neon } from "../../../db/schema";

async function getUsersORM() {
  const allUsers = await db.select().from(Playing_with_neon);
  return allUsers;
}

async function getUsers() {
  const users = await sql`
    SELECT * FROM playing_with_neon
  `;

  return users;
}

export async function GET(request: Request) {
  const resp = await getUsersORM();

  console.log("RESPOSTA", resp);
  return new Response(JSON.stringify(resp), {
    // Changed to JSON.stringify(resp)
    status: 200,
  });
}
