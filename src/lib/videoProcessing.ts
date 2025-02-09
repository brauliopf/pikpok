"use server";

import { redis } from "./redis";

export const pushVideoQueue = async (videoData: {
  videoId: string;
  s3Key?: string;
  title: string;
  clerkId: string;
  createdAt: Date;
  status: string;
}) => {
  await redis.rpush("pendingQueue", videoData);
};

export async function processNextVideo() {
  const videoJson = await redis.lpop("video:queue");
  if (!videoJson) return null;

  const video = JSON.parse(videoJson);
  await redis.hset(`video:${video.id}`, { status: "processing" });

//   try {
//     // Process video...
//     // const metadata = await extractMetadata(video.s3Key);
//     // const thumbnail = await generateThumbnail(video.s3Key);

//     await redis.hset(`video:${video.id}`, {
//       status: "completed",
//       metadata: JSON.stringify(metadata),
//       thumbnailUrl: thumbnail,
//       completedAt: Date.now(),
//     });
//   } catch (error) {
//     await redis.hset(`video:${video.id}`, {
//       status: "failed",
//       error: error.message,
//     });
//     throw error;
//   }
// }
