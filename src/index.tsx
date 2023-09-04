import { Elysia, t } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { html } from "@elysiajs/html";
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

  // .get("/todos", async () => {
  //   try {
  //     const data = await db.select().from(todos);
  //     return <TodoList todos={data} />;
  //   } catch (error) {
  //     console.error(error);
  //     return <p>Something went wrong</p>;
  //   }
  // })
  // .post(
  //   "/todos/toggle/:id",
  //   async ({ params }) => {
  //     const oldTodo = await db
  //       .select()
  //       .from(todos)
  //       .where(eq(todos.id, params.id))
  //       .get();
  //     const newTodo = await db
  //       .update(todos)
  //       .set({ completed: !oldTodo.completed })
  //       .where(eq(todos.id, params.id))
  //       .returning()
  //       .get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .delete(
  //   "/todos/:id",
  //   async ({ params }) => {
  //     await db.delete(todos).where(eq(todos.id, params.id)).run();
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .post(
  //   "/todos",
  //   async ({ body }) => {
  //     const newTodo = await db.insert(todos).values(body).returning().get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     body: t.Object({
  //       content: t.String({ minLength: 1 }),
  //     }),
  //   }
  // )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
