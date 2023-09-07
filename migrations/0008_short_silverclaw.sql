CREATE TABLE IF NOT EXISTS "visitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar NOT NULL,
	"ip" varchar NOT NULL,
	"user_agent" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_visited_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "visitors_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;