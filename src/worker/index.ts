import { getPage, getPublishedArticles } from "src/lib/notion"

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

import { blogPosts } from "src/db/schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { logger: false });

const getNotionPages = async () => {
  const pages = await getPublishedArticles();
  const pagesUpdated = await Promise.all(pages.map(async (page) => {
    const pageData = await getPage(page.id, false, true);
    console.log(Object.keys(page))
    // Check if in database
    // If not, add to database
    // If so, update database
    console.log(page.properties)

    const pageExists = await db.select().from(blogPosts).where(eq(blogPosts.notionId, page.id));
    if (pageExists.length === 0 || pageExists === undefined) {
      try {
        await db.update(blogPosts).set({
          title: page.properties.Name.title[0].plain_text,
          notionId: page.id,
          blocks: JSON.stringify(pageData.blocks),
          published: pageData.properties.Published.checkbox,
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log(pageExists)
    }

    return pageData;
  }))
  console.log(`Updated ${pagesUpdated.length} pages`);
}

getNotionPages();