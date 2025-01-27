"use server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

// const getAllVideos = async (): string[] {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: fileKey
//     });

//     const { Bucket, Key } = (command as any).input;
//     // const url = `https://${Bucket}.s3.amazonaws.com/${Key}`;

//     const url = await getSignedUrl(s3Client, command);

//     return url;
//   } catch (error) {
//     console.error("Error fetching image from S3:", error);
//     return "Error fetching image from S3";
//   }
// }

export async function download(fileKey: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    });

    const { Bucket, Key } = (command as any).input;
    // const url = `https://${Bucket}.s3.amazonaws.com/${Key}`;

    const url = await getSignedUrl(s3Client, command);

    return url;
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return "Error fetching image from S3";
  }
}
