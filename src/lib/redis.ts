// reference: https://upstash.com/docs/redis/sdks/ts/overview

// Use one queue for each status and have he status as key value
// Add to the right (rpush) and take next from the left (lpop)

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
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
