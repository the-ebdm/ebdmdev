import { Elysia, t } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { html } from "@elysiajs/html";
import { cron } from '@elysiajs/cron';
import { staticPlugin } from '@elysiajs/static'
import { logger } from '@bogeychan/elysia-logger';
import pretty from 'pino-pretty';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const stream = pretty({
  colorize: true
});

const queryConnection = postgres(process.env.DATABASE_URL!);
const migrationConnection = postgres(process.env.DATABASE_URL!);

const migrationDb = drizzle(migrationConnection, { logger: false });
await migrate(migrationDb, { migrationsFolder: './migrations' });
migrationConnection.end();

export const db = drizzle(queryConnection);

const app = new Elysia()
  .derive(() => {
    return {
      requestTime: Date.now(),
    }
  })
  .use(html())
  .use(
    logger({
      level: 'error',
      stream
    })
  )
  .use(autoroutes({ routesDir: './routes' }))
  // .use(
  //   cron({
  //     name: 'worker',
  //     pattern: '*/10 * * * * *',
  //     run() {

  //     }
  //   })
  // )
  .use(staticPlugin())
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .onResponse(({ request, set, requestTime }) => {
    const url = new URL(request.url, `http://${request.headers.host}`)
    const rs = Date.now() - requestTime
    console.log(`${url.pathname} - ${set.status} - ${rs}ms`)
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
