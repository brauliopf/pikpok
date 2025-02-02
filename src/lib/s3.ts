import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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

export async function uploadToS3(file: FileUpload, key: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.type,
    });
    const response = await s3Client.send(command);

    return {
      success: true,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
}

// Use type of object id aas type of key
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
