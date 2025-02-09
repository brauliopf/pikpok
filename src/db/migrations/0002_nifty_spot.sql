BEGIN;
ALTER TYPE "public"."status" ADD VALUE 'created' BEFORE 'pending';--> statement-breakpoint
COMMIT;

BEGIN;
ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'created';
COMMIT;