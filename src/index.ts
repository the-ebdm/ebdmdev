import { Elysia, t } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { cron } from '@elysiajs/cron';
import { cookie } from '@elysiajs/cookie'
import { staticPlugin } from '@elysiajs/static'

import { html } from "@middleware/html";
import { tracking } from '@middleware/tracking'
import { timing } from "@middleware/timing";

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { eq } from "drizzle-orm";
import { Job } from "@lib/job";
import { jobTypes, jobs } from "@db/schema";

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

console.log(`Running in ${process.env.NODE_ENV} mode`)

// Create db migrate and seed job types if they don't exist

db.select().from(jobTypes).then(async (results) => {
  if (results.length === 0) {
    console.log("Creating job types...");
    await db.insert(jobTypes).values({
      name: "migrate",
      description: "Run database migrations",
      handler: "db/migrate.ts",
    })
    await db.insert(jobTypes).values({
      name: "seed",
      description: "Seed the database",
      handler: "db/seed.ts",
    })
  }
})

// Create db migrate and seed jobs if they don't exist

db.select().from(jobs).then(async (results) => {
  if (results.length === 0) {
    console.log("Creating jobs...");
    // Get seed type
    const seedType = await db.select().from(jobTypes).where(eq(jobTypes.name, "seed"));
    if (seedType.length === 0) {
      throw new Error("Could not find seed job type!");
    }

    // Create seed job
    await db.insert(jobs).values({
      typeId: seedType[0].id,
      payload: {},
    })

    // Get migrate type
    const migrateType = await db.select().from(jobTypes).where(eq(jobTypes.name, "migrate"));
    if (migrateType.length === 0) {
      throw new Error("Could not find migrate job type!");
    }

    // Create migrate job
    await db.insert(jobs).values({
      typeId: migrateType[0].id,
      payload: {},
    })
  }
})