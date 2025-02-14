export interface VideoMetadata {
  summary?: string;
  topics?: string[];
  thumbnailUrl?: string;
}

export interface VideoIdToS3Key {
  id: string;
  s3Key: string;
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

export interface VideoIDKey {
  id: string;
  s3Key: string;
  title: string;
  status: string;
}
