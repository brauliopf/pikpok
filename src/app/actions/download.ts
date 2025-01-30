"use server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

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
        const url = await getSignedUrl(s3Client, command);
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
