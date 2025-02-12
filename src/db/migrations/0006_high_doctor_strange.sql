ALTER TABLE "users" ADD COLUMN "onboarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "videoDuration" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "topics_of_interest" text[];