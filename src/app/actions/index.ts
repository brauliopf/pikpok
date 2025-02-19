"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { generateMetadata, getTextEmbedding } from "@/lib/gemini";
import { mapVideoIdToUrl } from "@/lib/s3";
import { updateVideoMetadata } from "@/db/mutations/videos";
import { Redis } from "@upstash/redis";

export const completeOnboarding = async (formData: FormData) => {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboarded: true,
        topicsOfInterest: formData.getAll("topicsOfInterest"),
        videoDuration: formData.get("videoDuration"),
      },
    });
    return { message: "User metadata Updated" };
  } catch (e) {
    console.log("error", e);
    return { message: "Error Updating User Metadata" };
  }
};

export const generateVideoMetadata = async ({
  id,
  s3Key,
}: {
  id: string;
  s3Key: string;
}) => {
  console.log("generateVideoMetadata:", s3Key);
  // get video summary
  let summary = "";
  let interests = "";
  try {
    const s3Videos = await mapVideoIdToUrl([{ id, s3Key }]);
    const content = (await generateMetadata(s3Videos[0].url)) || {};
    summary = content.summary;
    interests = content.interests;
  } catch (e) {
    console.error("Error processing video", e);
  }

  // get summary embeddings
  const textEmbeddings = await getTextEmbedding(
    `${summary}. Interests: ${[interests].join(", ")}`
  );

  // store video metadata
  console.log(`${summary} Interests: ${[interests].join(",")}`);
  await updateVideoMetadata({
    id: id,
    summary,
    interests: Array.isArray(interests) ? interests : [interests],
    embeddings: textEmbeddings,
  });
};

export const queryRedisDB = async (
  key: string
): Promise<{ video_id: string; score: number }[] | null> => {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });

  const response = (await redis.get(key)) as
    | {
        video_id: string;
        score: number;
      }[]
    | null;
  return response;
};
