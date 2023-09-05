import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client"

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

const getPublishedArticles = async (sanitize: boolean = false) => {
  const { results } = await notion.databases.query({
    database_id: dbid,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      }
    }
  });
  return sanitize ? results.map(item => sanitizePage(item)) : results;
}

const getPublishedArticlesWithBlocks = async (sanitize: boolean = false) => {
  const client = new NotionAPI();
  client.fetch = properFetch;
  const results = await getPublishedArticles(sanitize);
  const pages = await Promise.all(
    results.map((item) => {
      return client.getPage(item.id).then((blocks) => {
        return {
          ...item,
          blocks: recordMapParser(blocks),
        };
      });
    })
  );

  return sanitize ? pages.map(item => sanitizePage(item)) : pages;
}

const getPage = async (pageId: string, sanitize: boolean = false, withBlocks: boolean = false) => {
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
  page.blocks = await Promise.all(blocks.results.map(async (block: any) => {
    if (block.type === "bookmark") {
      const res = await fetch(`http://api.linkpreview.net/?key=${process.env.LINKPREVIEW_TOKEN}&q=${block.bookmark.url}`);
      const data = await res.json();
      block.bookmark.preview = data;
    }
    return block;
  }));

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

export { getPublishedArticles, getPublishedArticlesWithBlocks, getPage };