ALTER TABLE "videos" RENAME COLUMN "metadata" TO "interests";--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "aisummary" text;