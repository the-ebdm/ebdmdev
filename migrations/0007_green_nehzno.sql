CREATE TABLE IF NOT EXISTS "mailing_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar NOT NULL,
	CONSTRAINT "mailing_list_email_unique" UNIQUE("email")
);
