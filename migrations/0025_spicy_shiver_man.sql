CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar NOT NULL,
	"path" varchar NOT NULL,
	"size" integer NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "papers" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" integer,
	"user_id" integer,
	"title" varchar,
	"authors" json,
	"abstract" text,
	"year" varchar,
	"tags" json,
	"url" varchar,
	"doi" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
