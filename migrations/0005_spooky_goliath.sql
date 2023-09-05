CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"notion_id" varchar,
	"name" varchar NOT NULL,
	"color" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;