import { BunFile } from 'bun';
import { Cache } from './cache';
import { describe, expect, it, beforeAll, afterAll, afterEach, beforeEach } from "bun:test";
import { unlinkSync } from "node:fs";

describe('Cache', () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache('test');
  });

  it('should set and get a value from the cache', async () => {
    const value = { name: 'John', age: 30 };
    await cache.set(value);
    const result = await cache.get();
    expect(result).toEqual(value);
  });

  it('should return undefined if the cache file does not exist', async () => {
    unlinkSync(cache.filePath);
    const result = await cache.get();
    expect(result).toBeUndefined();
  });
});