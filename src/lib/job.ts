// Event queue job
import { jobTypes, jobs } from "@db/schema";
import { Database } from "@types";
import { eq } from "drizzle-orm";

export interface Payload {
  [key: string]: any;
}

export interface Options {
  due?: Date;
}

export interface JobParams {
  id?: number;
  typeId: number;
  payload: Payload;
  due?: Date;
  completed?: boolean;
  completedAt?: Date | null;
  locked?: boolean;
  lockedAt?: Date | null;
}

type JobSelect = typeof jobs.$inferSelect;
type JobInsert = typeof jobs.$inferInsert;
type JobTypeSelect = typeof jobTypes.$inferSelect;

export class Job {
  id?: number;
  type?: JobTypeSelect;
  typeId: number;
  due: Date | undefined;
  completed?: boolean;
  completedAt?: Date | null;
  locked?: boolean;
  lockedAt?: Date | null;
  payload: Payload;

  verbose = false;

  constructor({ typeId, payload, id, due, completed, completedAt, locked, lockedAt }: JobParams) {
    this.typeId = typeId;
    this.payload = payload;
    this.id = id || undefined;
    this.due = due || undefined;
    this.completed = completed || false;
    this.completedAt = completedAt || null;
    this.locked = locked || false;
    this.lockedAt = lockedAt || null;
  }

  private log(message: string) {
    if (this.verbose) {
      console.log(message);
    }
  }

  private async fetchType(db: Database) {
    const results = await db.select().from(jobTypes).where(eq(jobTypes.id, this.typeId));
    if (results.length > 0) {
      this.type = results[0];
      return results[0];
    } else {
      throw new Error(`Job type ${this.typeId} not found!`);
    }
  }

  private format() {
    return {
      id: this.id,
      typeId: this.typeId,
      payload: this.payload,
      due: this.due,
      locked: this.locked,
      lockedAt: this.lockedAt || undefined,
      completed: this.completed,
      completedAt: this.completedAt || undefined,

    } as JobInsert;
  }

  async create(db: Database) {
    await db.insert(jobs).values({
      ...this.format(),
    }).returning().execute().then(result => {
      this.id = result[0].id;
    })
  }

  async update(db: Database) {
    if (this.id === undefined) {
      throw new Error("Cannot update job without id");
    } else {
      return await db.update(jobs).set({
        ...this.format(),
      }).where(eq(jobs.id, this.id)).returning().execute()
    }
  }

  static async find(db: Database, id: number) {
    const results = await db.select().from(jobs).where(eq(jobs.id, id));
    if (results.length === 0) {
      return null;
    } else {
      const job = results[0];
      return new Job({
        id: job.id,
        typeId: job.typeId,
        payload: job.payload!,
        due: job.due,
        completed: job.completed,
        completedAt: job.completedAt!,
      });
    }
  }

  static async findOutstanding(db: Database) {
    const results = await db.select().from(jobs).where(eq(jobs.completed, false));
    return results.map(job => {
      const { id, typeId, payload, due, completed, completedAt, locked, lockedAt } = job as JobSelect;
      return new Job({ id, typeId, due, completed, completedAt, locked, lockedAt, payload: payload! });
    });
  }

  async lock(db: Database) {
    if (!this.id) {
      throw new Error("Cannot lock job without id");
    } else {
      this.locked = true;
      this.lockedAt = new Date();
      await db.update(jobs).set({
        locked: this.locked,
        lockedAt: this.lockedAt,
      });
    }
  }

  async isLocked(db: Database) {
    if (!this.id) {
      throw new Error("Cannot check lock on job without id");
    } else {
      const results = await db.select().from(jobs).where(eq(jobs.id, this.id));
      if (results.length === 0) {
        throw new Error(`Job ${this.id} not found!`);
      } else {
        return results[0].locked;
      }
    }
  }

  async unlock(db: Database) {
    if (!this.id) {
      throw new Error("Cannot unlock job without id");
    } else {
      this.locked = false;
      this.lockedAt = null;
      await db.update(jobs).set({
        locked: this.locked,
        lockedAt: this.lockedAt,
      }).where(eq(jobs.id, this.id));
    }
  }

  async run(db: Database) {
    try {
      this.log(`Running job ${this.id}...`);
      const type = await this.fetchType(db);
      this.log(`Found job type ${type.name}!`);

      this.log(`Locking job ${this.id}...`)
      await this.lock(db);
      this.log(`Running handler ${type.handler}...`)
      const output = await require(`@jobs/${type.handler}`).default({
        db: db,
        payload: this.payload
      });
      this.log(`Handler ${type.handler} completed!`);
      return output;
    } catch (error) {
      this.log(`Error running job ${this.id}!`)
      throw error;
    }
  }

  async markComplete(db: Database) {
    if (!this.id) {
      throw new Error("Cannot mark job complete without id");
    }
    this.completed = true;
    this.log(`Updating job ${this.id}...`)
    await db.update(jobs).set({
      completed: true,
      completedAt: new Date(),
    }).where(eq(jobs.id, this.id!)).execute();
  }
}