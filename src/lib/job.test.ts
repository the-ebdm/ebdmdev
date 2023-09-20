import { Job } from './job';
import { Database } from '@types';
import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { describe, expect, it, beforeAll, afterAll, afterEach } from "bun:test";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { JobType, jobTypes, jobs } from '@db/schema';

describe('Job', () => {
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

  afterAll(async () => {
    // Close database connection
    await db.delete(jobTypes);
    await connection.end();
  });

  afterEach(async () => {
    await db.delete(jobs);
  });

  describe('create', () => {
    it('should create a new job in the database', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      expect(job.id).toBeDefined();
      expect(job.typeId).toBe(1);
      expect(job.payload).toEqual({ foo: 'bar' });

      const result = await db.select().from(jobs).where(eq(jobs.id, job.id!));
      expect(result.length).toBe(1);
      expect(result[0].typeId).toBe(1);
      expect(result[0].payload).toEqual({ foo: 'bar' });
    });
  });

  describe('update', () => {
    it('should update an existing job in the database', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      job.payload = { baz: 'qux' };
      await job.update(db);

      const result = await db.select().from(jobs).where(eq(jobs.id, job.id!));
      expect(result.length).toBe(1);
      expect(result[0].payload).toEqual({ baz: 'qux' });
    });

    it('should throw an error if job has no id', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      try {
        await job.update(db);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('find', () => {
    it('should return null if job is not found', async () => {
      const job = await Job.find(db, 999);

      expect(job).toBeNull();
    });

    it('should return a job if it is found', async () => {
      const expectedJob = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await expectedJob.create(db);

      const job = await Job.find(db, expectedJob.id!);

      expect(job).toBeDefined();
      expect(job!.id).toBe(expectedJob.id);
      expect(job!.typeId).toBe(expectedJob.typeId);
      expect(job!.payload).toEqual(expectedJob.payload);
    });
  });

  describe('findOutstanding', () => {
    it('should return an empty array if no outstanding jobs are found', async () => {
      const jobs = await Job.findOutstanding(db);

      expect(jobs).toEqual([]);
    });

    it('should return an array of outstanding jobs', async () => {
      const expectedJob = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await expectedJob.create(db);

      const jobs = await Job.findOutstanding(db);

      expect(jobs.length).toBe(1);
      expect(jobs[0].id).toBe(expectedJob.id);
      expect(jobs[0].typeId).toBe(expectedJob.typeId);
      expect(jobs[0].payload).toEqual(expectedJob.payload);
    });
  });

  describe('lock', () => {
    it('should lock a job', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      await job.lock(db);

      const result = await db.select().from(jobs).where(eq(jobs.id, job.id!));
      expect(result.length).toBe(1);
      expect(result[0].locked).toBe(true);
    });

    it('should throw an error if job has no id', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      try {
        await job.lock(db);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('isLocked', () => {
    it('should return false if job is not locked', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      const isLocked = await job.isLocked(db);

      expect(isLocked).toBe(false);
    });

    it('should return true if job is locked', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      await job.lock(db);

      const isLocked = await job.isLocked(db);

      expect(isLocked).toBe(true);
    });

    it('should throw an error if job has no id', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      try {
        await job.isLocked(db);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('unlock', () => {
    it('should unlock a job', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);

      await job.lock(db);
      await job.unlock(db);

      const result = await db.select().from(jobs).where(eq(jobs.id, job.id!));
      expect(result.length).toBe(1);
      expect(result[0].locked).toBe(false);
    });

    it('should throw an error if job has no id', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      try {
        await job.unlock(db);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('run', () => {
    it('should run a job', async () => {
      const jobType = {
        name: 'test job type',
        description: 'test job type description',
        handler: 'test',
      }
      const ids = await db.insert(jobTypes).values(jobType).returning({ insertedId: jobTypes.id }).execute();
      const job = new Job({
        typeId: ids[0].insertedId!,
        payload: { foo: 'bar' },
      });

      await job.create(db);
      const result = await job.run(db);

      expect(result).toBe(true);
    });
  });

  describe('markComplete', () => {
    it('should mark a job as complete', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      await job.create(db);
      await job.markComplete(db);

      const result = await db.select().from(jobs).where(eq(jobs.id, job.id!));
      expect(result.length).toBe(1);
      expect(result[0].completed).toBe(true);
    });

    it('should throw an error if job has no id', async () => {
      const job = new Job({
        typeId: 1,
        payload: { foo: 'bar' },
      });

      try {
        await job.markComplete(db);
      } catch (error) {
        expect(error);
      }
    });
  });
});