"use server";
// reference: https://upstash.com/docs/redis/sdks/ts/overview

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url:
    process.env.UPSTASH_REDIS_URL ||
    "https://adapting-escargot-11107.upstash.io",
  token:
    process.env.UPSTASH_REDIS_TOKEN ||
    "AStjAAIjcDFhOTEzNTM3MmQ1MzE0ZDE0YWE1NmE1NjJmMDMzMTY1MXAxMA",
});

// STRING OBJ TYPES
// create new key value pair
// await redis.set("foo", "bar");

// update only
// await redis.set("foo", "BAAAR", {
//   xx: true,
// });

// update only if it exist
// await redis.setnx("foo", "BAAAR");
