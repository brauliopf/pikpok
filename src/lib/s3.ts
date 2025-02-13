"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { VideoIdToS3Key, VideoIdToUrl } from "@/types/video";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * get url for all selected videos
 * replaces s3Key for url
 */
export async function mapVideoIdToUrl(
  videos: (VideoIdToS3Key & { creator_id: string; creator_img: string })[]
): Promise<(VideoIdToUrl & { creator_id: string; creator_img: string })[]> {
  try {
    const downloadPromises: Promise<
      VideoIdToUrl & { creator_id: string; creator_img: string }
    >[] = videos.map(async (video) => {
      try {
        // get url
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: video.s3Key,
        });
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        const { s3Key, ...output } = video;
        return {
          ...output,
          url: url,
        } as VideoIdToUrl & { creator_id: string; creator_img: string };
      } catch (error) {
        console.error(`Error fetching file ${video} from S3:`, error);
        return {
          id: video.id,
          url: "",
          similarity: 0,
          creator_id: video.creator_id,
          error: `Error fetching file ${video} from S3`,
        } as VideoIdToUrl & {
          creator_id: string;
          creator_img: string;
          error?: string;
        };
      }
    });

    const results = await Promise.all(downloadPromises);

    return results;
  } catch (error) {
    console.error("Error in batch download operation:", error);
    throw error;
  }
}

export async function uploadVideoToS3(formData: FormData): Promise<{
  success: boolean;
  filename?: string;
  error?: string;
}> {
  try {
    const file = formData.get("video") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (file.type !== "video/mp4") {
      return {
        success: false,
        error: "Invalid file type. Please upload a video.",
      };
    }

    // Validate file size
    const maxSize = 40 * 1024 * 1024; // 40MB
    if (file.size > maxSize) {
      return { success: false, error: "File too large. Maximum size is 40MB." };
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const filename = `videos/${randomUUID()}.mp4`;

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: "video/mp4",
    };
    await s3Client.send(new PutObjectCommand(params));

    return {
      success: true,
      filename: filename,
      error: "",
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: "Failed to upload video" };
  }
}
