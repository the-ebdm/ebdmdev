import { pgTable, serial, text, varchar, boolean, timestamp, json, integer } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: serial('id').primaryKey(),
  notionId: varchar("notion_id"),
  name: varchar("name").notNull(),
  color: varchar("color").notNull(),
});

export type Tag = typeof tags.$inferSelect;

export const jobs = pgTable("jobs", {
  id: serial('id').primaryKey(),
  typeId: integer("type_id").notNull(),
  due: timestamp("due").notNull().defaultNow(),
  payload: json("payload"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  locked: boolean("locked").notNull().default(false),
  lockedAt: timestamp("locked_at"),
});

export type Job = typeof jobs.$inferSelect;

export const jobTypes = pgTable("job_types", {
  id: serial('id').primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  handler: varchar("handler").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type JobType = typeof jobTypes.$inferSelect;

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

export const files = pgTable("files", {
  id: serial('id').primaryKey(),
  userId: varchar("user_id"),
  name: varchar("name").notNull(),
  path: varchar("path").notNull(),
  size: integer("size").notNull(),
  type: varchar("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const papers = pgTable("papers", {
  id: serial('id').primaryKey(),
  fileId: integer("file_id"),
  userId: varchar("user_id"),
  title: varchar("title"),
  authors: json("authors"),
  abstract: text("abstract"),
  year: varchar("year"),
  tags: json("tags"),
  url: varchar("url"),
  doi: varchar("doi"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type File = typeof files.$inferSelect;
export type FileInsert = typeof files.$inferInsert;
export type Paper = typeof papers.$inferSelect;
export type PaperInsert = typeof papers.$inferInsert;

export const cache = pgTable("cache", {
  id: serial('id').primaryKey(),
  key: varchar("key").notNull().unique(),
  value: json("value").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Cache = typeof cache.$inferSelect;
export type CacheInsert = typeof cache.$inferInsert;