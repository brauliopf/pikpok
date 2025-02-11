-- must create type "vector" before migrate: run this in the SQL query editor = CREATE EXTENSION vector;
ALTER TABLE "videos" ADD COLUMN "embeddings" vector(768) DEFAULT NULL;