import { pgTable, serial, text, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: serial('id').primaryKey(),
  notionId: varchar("notion_id"),
  name: varchar("name").notNull(),
  color: varchar("color").notNull(),
});

export type Tag = typeof tags.$inferSelect;

export const jobs = pgTable("jobs", {
  id: serial('id').primaryKey(),
  type: varchar("type").notNull(),
  due: timestamp("due").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export type Job = typeof jobs.$inferSelect;

export const links = pgTable("links", {
  id: serial('id').primaryKey(),
  url: varchar("url").notNull().unique(),
  title: varchar("title").notNull(),
  notionId: varchar("notion_id"),
  description: text("description"),
  image: varchar("image"),
});

export type Link = typeof links.$inferSelect;

export const mailingList = pgTable("mailing_list", {
  id: serial('id').primaryKey(),
  name: varchar("name").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  email: varchar("email").notNull().unique(),
});

export type MailingList = typeof mailingList.$inferSelect;
export type MailingListInsert = typeof mailingList.$inferInsert;

export const visitors = pgTable("visitors", {
  id: serial('id').primaryKey(),
  token: varchar("token").notNull().unique(),
  ip: varchar("ip").notNull(),
  userAgent: varchar("user_agent").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastVisitedAt: timestamp("last_visited_at").notNull().defaultNow(),
});

export type Visitor = typeof visitors.$inferSelect;
export type VisitorInsert = typeof visitors.$inferInsert;