import { InferSelectModel } from "drizzle-orm";
import { likes } from "@/db/schema";

export interface VideoMetadata {
  summary?: string;
  topics?: string[];
  thumbnailUrl?: string;
}

export interface VideoIdToS3Key {
  id: string;
  s3_key: string;
  similarity?: number;
  creator_id: string;
  creator_img: string;
}

export interface VideoIdToUrl {
  id: string;
  url: string;
  similarity: number;
  creator_id: string;
  creator_img: string;
}

export type SelectLikes = InferSelectModel<typeof likes>;

export type VideoIDKey = {
  id: string;
  s3Key: string;
  title: string;
  status: string;
};
