// A basic JSON file cache
import { cache } from "@db/schema";
import { Database } from "@types";
import { BunFile } from "bun";
import { eq } from "drizzle-orm";
import { mkdir } from "node:fs/promises";

export class Cache {
  private key: string;
  public filePath: string;
  private file: BunFile;
  private db?: Database;
  public expiresAt?: Date;

  constructor({ key, db, expiresAt }: { key: string, db?: Database, expiresAt?: Date }) {
    this.key = key;
    this.filePath = process.env.PWD + '/.cache/' + this.key;
    this.file = Bun.file(this.filePath)
    this.db = db;
    this.expiresAt = expiresAt;
  }

  private async ensureParentDirectoryExists(): Promise<void> {
    const parentDirectory = this.filePath.split('/').slice(0, -1).join('/');
    await mkdir(parentDirectory, { recursive: true });
  }

  public async get(): Promise<any> {
    try {
      return await this.file.json();
    } catch (error) {
      if (this.db) {
        const dbCache = await this.db.select().from(cache).where(eq(cache.key, this.key)).execute();
        if (dbCache.length > 0) {
          const value = dbCache[0].value;
          this.set(value, true);
          return value;
        }
      }
      return undefined;
    }
  }

  public async set(value: any, fromDb: boolean = false): Promise<void> {
    await this.ensureParentDirectoryExists();
    await Bun.write(this.filePath, JSON.stringify(value));
    // If fromDb is true, we don't want to write to the database again
    // If fromDb is false, we want to write the value to the database
    if (fromDb === false && this.db) {
      const dbCache = await this.db.select().from(cache).where(eq(cache.key, this.key)).execute();
      if (dbCache.length > 0) {
        await this.db.update(cache).set({ value }).where(eq(cache.key, this.key)).execute();
      } else {
        await this.db.insert(cache).values({ key: this.key, value }).execute();
      }
    }
  }
}