import html from '@kitajs/html'

import { t } from 'elysia'
import { db } from '../../../index';
import { FileInsert, PaperInsert, files, papers } from '@db/schema';
import { getUserFromToken } from '@lib/clerk';

export const post = {
  handler: async ({ body, cookie }: any) => {
    try {
      const user = await getUserFromToken(cookie.__clerk_db_jwt);
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
      await db.insert(papers).values(paperEntry);
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