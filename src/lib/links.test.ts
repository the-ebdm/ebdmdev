import { describe, expect, it, beforeAll, afterAll, afterEach } from "bun:test";
import { Link } from './links';
import { Database } from "@types";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { links } from "@db/schema";

describe('Link', () => {
  let db: Database;
  let connection: postgres.Sql;
  const url = 'https://example.com';
  const link = new Link(url);

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'development') {
      connection = postgres(process.env.TEST_DATABASE_URL!);
    } else {
      connection = postgres(process.env.DATABASE_URL!);
    }
    db = drizzle(connection);
    // Run migrations
    await migrate(db, { migrationsFolder: './migrations' });
  });

  afterAll(async () => {
    // Close database connection
    await db.delete(links);
    await connection.end();
  });

  afterEach(async () => {
    await db.delete(links);
  });

  describe('fetchInfo', () => {
    it('should fetch info for the link', async () => {
      await link.fetchInfo();
      expect(link.title).toBeDefined();
      expect(link.description).toBeDefined();
      expect(link.image).toBeDefined();
    });
  });

  describe('check', () => {
    it('should return false if the link is not in the database', async () => {
      const result = await link.check(db);
      expect(result).toBe(false);
    });

    it('should return true if the link is in the database', async () => {
      // Insert the link into the database
      await link.save(db);

      const result = await link.check(db);
      expect(result).toBe(true);
    });
  });

  describe('save', () => {
    it('should save the link to the database', async () => {
      await link.save(db);

      // Check that the link is in the database
      const result = await link.check(db);
      expect(result).toBe(true);
    });

    it('should update the link in the database if it already exists', async () => {
      // Update the link's title
      link.title = 'New Title';

      await link.save(db);

      // Check that the link's title was updated in the database
      const updatedLink = new Link(url);
      await updatedLink.check(db);
      expect(updatedLink.title).toBe('New Title');
    });
  });
});