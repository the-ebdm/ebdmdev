CREATE TABLE IF NOT EXISTS "cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cache_key_unique" UNIQUE("key")
);
