export interface VideoMetadata {
  summary?: string;
  topics?: string[];
  thumbnailUrl?: string;
}

export interface VideoIDKey {
  id: string;
  s3Key: string;
  title: string;
  status: string;
}
