import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client"
import { Cache } from "./cache";
import { Link } from "./links";
import { Database } from "@types";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const dbid = "3a58bc30-8715-46d4-814f-ed9f777b2a72"

const properFetch = async <T>({ endpoint, body, gotOptions, headers: clientHeaders }: any): Promise<T> => {
  const headers: any = {
    ...clientHeaders,
    ...gotOptions?.headers,
    'Content-Type': 'application/json'
  }

  const url = `https://www.notion.so/api/v3/${endpoint}`

  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers
  }).then(res => res.json())
}

const recordMapParser = (recordMap: any) => {
  const blocks = Object.keys(recordMap.block)
    .map((item) => recordMap.block[item])
    .map((item) => item.value);
  return blocks;
};

export const getPublishedArticles = async (sanitize: boolean = false) => {
  const cache = new Cache({ key: "articles/index" });
  const cached = await cache.get();
  if (cached !== undefined) {
    console.log(`Using cached articles`)
    return cached;
  } else {
    console.log(`Fetching articles from Notion`)
    const { results } = await notion.databases.query({
      database_id: dbid,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        }
      }
    });
    await cache.set(results);
    return results;
  }
}

export const getPublishedArticlesWithBlocks = async (sanitize: boolean = false) => {
  const client = new NotionAPI();
  client.fetch = properFetch;
  const results = await getPublishedArticles(sanitize);
  const pages = await Promise.all(
    results.map((item: any) => {
      return client.getPage(item.id).then((blocks) => {
        return {
          ...item,
          blocks: recordMapParser(blocks),
        };
      });
    })
  );

  return pages;
}

const bookmarkify = async (db: Database, blocks: any) => {
  return await Promise.all(blocks.results.map(async (block: any) => {
    if (block.type === "bookmark") {
      const link = new Link(block.bookmark.url);
      if (await link.check(db)) {
        block.bookmark.preview = link;
      } else {
        await link.fetchInfo();
        block.bookmark.preview = link;
        await link.save(db);
      }
    }
    return block;
  }));
}

export const getPage = async (db: Database, pageId: string) => {
  const cache = new Cache({ key: `articles/${pageId}`, db });
  const cached = await cache.get();
  if (cached !== undefined) {
    console.log(`Using cached page ${pageId}`)
    return cached;
  }
  const client = new NotionAPI({
    authToken: process.env.NOTION_TOKEN!
  });
  client.fetch = properFetch;

  const recordMap = await client.getPage(pageId);
  const page: any = await notion.pages.retrieve({ page_id: pageId });
  const blocks = await notion.blocks.children.list({ block_id: pageId }).then(blocks => {
    return blocks;
  })

  page.recordMap = recordMapParser(recordMap);
  page.blocks = await bookmarkify(db, blocks);

  await cache.set(page);
  return page;
}