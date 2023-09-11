import { Elysia, t } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { cron } from '@elysiajs/cron';
import { cookie } from '@elysiajs/cookie'
import { staticPlugin } from '@elysiajs/static'

import { html } from "@middleware/html";
import { tracking } from '@middleware/tracking'
import { timing } from "@middleware/timing";

import { logger } from '@bogeychan/elysia-logger';
import pretty from 'pino-pretty';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Job } from "@lib/job";

const stream = pretty({
  colorize: true
});

const queryConnection = postgres(process.env.DATABASE_URL!);
// Core migration code
// const migrationConnection = postgres(process.env.DATABASE_URL!);

// const migrationDb = drizzle(migrationConnection, { logger: false });
// await migrate(migrationDb, { migrationsFolder: './migrations' });
// migrationConnection.end();

export const db = drizzle(queryConnection);

const app = new Elysia()
  .use(timing())
  .use(cookie())
  .use(html())
  .use(tracking())
  .use(
    logger({
      level: 'error',
      stream
    })
  )
  .use(autoroutes({ routesDir: './routes' }))
  .use(cron({
    name: 'worker',
    pattern: '*/10 * * * * *',
    async run() {
      const jobs = await Job.findOutstanding(db);
      if (jobs.length > 0) {
        console.log(`Found ${jobs.length} jobs to run!`);
        await Promise.all(jobs.map(async (job) => {
          if (job.locked === false) {
            await job.lock(db);
            await job.run(db);
            await job.unlock(db);
            await job.markComplete(db);
          }
        }))
      }
    }
  }))
  .use(staticPlugin())
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
