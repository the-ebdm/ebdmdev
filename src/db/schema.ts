import { pgTable, serial, text, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
  id: serial('id').primaryKey(),
  title: text("title").notNull(),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  notionId: varchar("notion_id"),
  blocks: json("blocks").$type<any[]>(),
});

export type BlogPost = typeof blogPosts.$inferSelect;

export const jobs = pgTable("jobs", {
  id: serial('id').primaryKey(),
  type: varchar("type").notNull(),
  due: timestamp("due").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export type Job = typeof jobs.$inferSelect;