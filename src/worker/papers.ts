import { Paper, files, papers } from "@db/schema";
import { eq, isNull } from "drizzle-orm";
import { db } from "src/index";

const processPapers = async (papers: Paper[]) => {
  const processes = Promise.all(papers.map(async (paper) => {
    const file = await db.select().from(files).where(eq(files.id, paper.fileId!));
    if (file.length === 0) {
      console.log(`Paper ${paper.id} has no file!`);
      return;
    }


  }));
}

const run = async () => {
  const paperData = await db.select().from(papers).where(isNull(papers.abstract));

  await processPapers(paperData);
}