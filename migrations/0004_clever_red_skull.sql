ALTER TABLE "blog_posts" ADD COLUMN "blocks" json;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN IF EXISTS "blocks";