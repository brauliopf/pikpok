"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

interface FileUpload {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function downloadMultipleFiles(
  fileKeys: string[]
): Promise<{ fileKey: string; url: string }[]> {
  try {
    const downloadPromises = fileKeys.map(async (fileKey) => {
      try {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileKey,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { fileKey, url };
      } catch (error) {
        console.error(`Error fetching file ${fileKey} from S3:`, error);
        return { fileKey, url: `Error fetching file ${fileKey} from S3` };
      }
    });

    const results = await Promise.all(downloadPromises);

    return results;
  } catch (error) {
    console.error("Error in batch download operation:", error);
    throw error;
  }
}

export async function uploadVideoToS3(formData: FormData) {
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
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: "Failed to upload video" };
  }
}

export async function getFromS3(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    return {
      success: true,
      data: await response.Body?.transformToByteArray(),
    };
  } catch (error) {
    console.error("Error getting from S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}

export async function deleteFromS3(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}

export async function download(fileKey: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3Client, command);

    return url;
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return "Error fetching image from S3";
  }
}

export async function getAllVideos(): Promise<string[]> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: "videos/0f37ae3f-48df-4ac5-a465-a6880e7f0da2.mp4",
    });

    const url = await getSignedUrl(s3Client, command);

    let output = [];
    output.push(url);

    return output;
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return ["Error fetching image from S3"];
  }
}
