"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function uploadVideoToS3(formData: FormData) {
  const file = formData.get("video") as File;

  if (!file || !(file instanceof File)) {
    throw new Error("No file uploaded");
  }

  // Validate file type and size
  if (file.type !== "video/mp4") {
    throw new Error("Only MP4 files are allowed");
  }

  const fileBuffer = await file.arrayBuffer();
  const fileName = `videos/${randomUUID()}.mp4`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(fileBuffer),
    ContentType: "video/mp4",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return {
      success: true,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload video");
  }
}
