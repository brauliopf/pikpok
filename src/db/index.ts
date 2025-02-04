import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

console.log("FROM DB INDEX", process.env.DATABASE_URL);

const sql = neon(
  "postgres://neondb_owner:npg_KDYQibL2dWA3@ep-royal-bird-a48qn7t8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
);
// const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
