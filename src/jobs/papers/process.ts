import { papers } from "@db/schema"
import { Database } from "@types"
import { eq } from "drizzle-orm"

import { processPaper } from "@lib/ai/papers"

export default async function handler({ db, payload }: { db: Database, payload: any }) {
  const { paperId, userId } = payload

  console.log(`Processing paper ${paperId} for user ${userId}`)

  const paper = (await db.select().from(papers).where(eq(papers.id, paperId)).execute())[0];

  await processPaper({ paper })
}