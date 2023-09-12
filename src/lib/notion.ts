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

export const getPublishedArticles = async () => {
  return await notion.databases.query({
    database_id: dbid,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      }
    }
  }) as any;
}

export const getPage = async (pageId: string) => {
  const client = new NotionAPI({ authToken: process.env.NOTION_TOKEN! });
  client.fetch = properFetch;

  const recordMap = await client.getPage(pageId);
  const page = await notion.pages.retrieve({ page_id: pageId }) as any;
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

  return page;
}