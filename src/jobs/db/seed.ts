import { jobTypes } from "@db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const name = "Seed Database";
export const description = "Seed the database with data";

export default async function handler() {
  const seedConnection = postgres(process.env.DATABASE_URL!);
  const db = drizzle(seedConnection, { logger: false });

  await db.insert(jobTypes).values([
    {
      name: "Seed Database",
      description: "Seed the database with data",
      handler: "db/seed",
    },
    {
      name: "Migrate Database",
      description: "Update the database migrations",
      handler: "db/migrate",
    }
  ])
}