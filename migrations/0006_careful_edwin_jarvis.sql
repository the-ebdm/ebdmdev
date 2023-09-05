CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"title" varchar NOT NULL,
	"notion_id" varchar,
	"description" text,
	"image" varchar,
	CONSTRAINT "links_url_unique" UNIQUE("url")
);
--> statement-breakpoint
DROP TABLE "blog_posts";