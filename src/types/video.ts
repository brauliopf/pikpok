export interface VideoMetadata {
  id: string;
  s3Key: string;
  title: string;
  clerkId: string;
  status: "pending" | "processing" | "completed" | "failed";
  metadata?: {
    duration?: number;
    resolution?: string;
    topics?: string[];
    thumbnailUrl?: string;
  };
}
