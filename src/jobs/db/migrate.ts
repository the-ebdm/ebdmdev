import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export default async function handler() {
  const migrationConnection = postgres(process.env.DATABASE_URL!);

  const migrationDb = drizzle(migrationConnection, { logger: false });
  await migrate(migrationDb, { migrationsFolder: './migrations' });
  migrationConnection.end();
}