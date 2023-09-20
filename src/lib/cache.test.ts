import { Database } from '@types';
import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { Cache } from './cache';
import { describe, expect, it, beforeAll, afterAll, afterEach, beforeEach } from "bun:test";
import { unlinkSync } from "node:fs";
import { cache as CacheTable } from '@db/schema';

describe('Cache', () => {
  let cache: Cache;
  let db: Database;
  let connection: postgres.Sql;

  beforeAll(async () => {
    // Initialize database connection
    if (process.env.NODE_ENV === 'development') {
      connection = postgres(process.env.TEST_DATABASE_URL!);
    } else {
      connection = postgres(process.env.DATABASE_URL!);
    }
    db = drizzle(connection);
    // Run migrations
    await migrate(db, { migrationsFolder: './migrations' });
  });

  beforeEach(() => {
    cache = new Cache({
      key: 'test',
      db
    });
  });

  afterAll(async () => {
    // Close database connection
    await db.delete(CacheTable);
    await connection.end();
  });

  it('should set and get a value from the cache', async () => {
    const value = { name: 'John', age: 30 };
    await cache.set(value);
    const result = await cache.get();
    expect(result).toEqual(value);
  });

  it('should return undefined if the cache file does not exist', async () => {
    cache = new Cache({
      key: 'test',
    });
    unlinkSync(cache.filePath);
    const result = await cache.get();
    expect(result).toBeUndefined();
  });
});