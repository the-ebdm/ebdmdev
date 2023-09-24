import html from '@kitajs/html'

import { t } from 'elysia'
import { db } from '../../../index';
import { FileInsert, PaperInsert, files, papers } from '@db/schema';
import { getUserFromToken } from '@lib/clerk';
import { Job } from '@lib/job';
import { authenticate } from '@lib/auth';

export const post = {
  handler: async ({ body, cookie }: any) => {
    try {
      const user = await authenticate(db, cookie.token);
      // Save file to disk
      const path = `${process.env.PWD}/uploads/${body.name}`
      await Bun.write(path, body.file);
      const file = Bun.file("./package.json");
      // Create database record for file
      const fileEntry = {
        name: body.name,
        userId: user.id,
        path: path,
        size: file.size,
        type: file.type,
      } as FileInsert;
      const [fileData] = await db.insert(files).values(fileEntry).returning();
      const paperEntry = {
        title: body.name,
        userId: user.id,
        fileId: fileData.id,
      } as PaperInsert;
      const ids = await db.insert(papers).values(paperEntry).returning();
      paperEntry.id = ids[0].id;

      // Create process job
      const job = new Job({
        typeId: 2,
        payload: {
          paperId: paperEntry.id,
          userId: user.id,
        }
      });
      await job.create(db);

      return (
        <p>
          {paperEntry.title} uploaded successfully!
        </p>
      )
    } catch (error) {
      console.error(error)
    }
  },
  hooks: {
    body: t.Object({
      file: t.File(),
      name: t.String()
    })
  }
}