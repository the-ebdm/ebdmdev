import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client"
import { Link } from "./links";
import { RedisClientType } from "redis";

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

const getPublishedArticles = async (redis: RedisClientType) => {
  let results = await redis.get('publishedArticles');
  if (!results) {
    results = await notion.databases.query({
      database_id: dbid,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        }
      }
    }) as any;
    await redis.set('publishedArticles', JSON.stringify(results));
  } else {
    results = JSON.parse(results);
  }
  return results;
}

const getPage = async (redis: RedisClientType, pageId: string, sanitize: boolean = false) => {
  let page = await redis.get(`page:${pageId}`) as any;
  if (!page) {
    const client = new NotionAPI({ authToken: process.env.NOTION_TOKEN! });
    client.fetch = properFetch;

    const recordMap = await client.getPage(pageId);
    page = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({ block_id: pageId });

    page.recordMap = recordMapParser(recordMap);
    page.blocks = await Promise.all(blocks.results.map(async (block: any) => {
      if (block.type === "bookmark") {
        const link = new Link(block.bookmark.url);
        if (await link.check()) {
          block.bookmark.preview = link;
        } else {
          await link.fetchInfo();
          block.bookmark.preview = link;
          await link.save();
        }
      }
      return block;
    }));
    await redis.set(`page:${pageId}`, JSON.stringify(page));
  } else {
    page = JSON.parse(page);
  }

  return sanitize ? sanitizePage(page) : page;
}

const sanitizePage = (page: any) => {
  const { id, properties, blocks } = page;
  const { Name, Published } = properties;

  return {
    id,
    name: Name.title[0].plain_text,
    published: Published.checkbox,
    blocks,
  };
}

export { getPublishedArticles, getPage };