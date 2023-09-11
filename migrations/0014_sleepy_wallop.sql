CREATE TABLE IF NOT EXISTS "job_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"handler" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "type_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN IF EXISTS "type";