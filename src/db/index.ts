import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
  connectionString: process.env.DATABASE_URL!
});

export const db = drizzle(client, { schema, logger: true });

// const sqlite = new Database('local.db');
// export const db: BunSQLiteDatabase = drizzle(sqlite);