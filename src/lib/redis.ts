// reference: https://upstash.com/docs/redis/sdks/ts/overview

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

// LIST OBJ TYPES
// // Adding to queue (at the right end)
// await redis.RPUSH('video-queue', JSON.stringify(videoData));

// // Processing from queue (from the left end)
// const nextVideo = await redis.LPOP('video-queue');
// if (nextVideo) {
//   const videoData = JSON.parse(nextVideo);
//   // process video...
// }
