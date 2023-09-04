import { Elysia, t } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { html } from "@elysiajs/html";
import { cron } from '@elysiajs/cron';
import { logger } from '@bogeychan/elysia-logger';
import pretty from 'pino-pretty';
import * as elements from "typed-html";
import { blogPosts } from "./db/schema";
import { eq } from "drizzle-orm";

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import postgres from 'postgres';

const stream = pretty({
  colorize: true
});

const queryConnection = postgres(process.env.DATABASE_URL!);
const migrationConnection = postgres(process.env.DATABASE_URL!);

const migrationDb = drizzle(migrationConnection, { logger: false });
await migrate(migrationDb, { migrationsFolder: './drizzle' });
migrationConnection.end();

export const db = drizzle(queryConnection);

const app = new Elysia()
  .use(html())
  .use(
    logger({
      level: 'error',
      stream
    })
  )
  .use(autoroutes({ routesDir: './routes' }))
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .use(
    cron({
      name: 'worker',
      pattern: '*/10 * * * * *',
      run() {
        console.log('Heartbeat')
      }
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
