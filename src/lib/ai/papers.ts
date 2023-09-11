import { Paper, files, papers } from "@db/schema";
import { eq } from "drizzle-orm";
import { db } from "src";

import { z } from "zod";

import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { createMetadataTaggerFromZod } from "langchain/document_transformers/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RedisClientType } from "redis";
import { OpenAIChat } from "langchain/llms/openai";

const zodPaper = z.object({
  title: z.string().describe("The title of the paper"),
  abstract: z.string().describe("The abstract of the paper"),
  authors: z.array(z.string()).describe("The authors of the paper"),
  year: z.number().describe("The year the paper was published"),
  tags: z.array(z.string()).describe("Tags to describe the paper's content"),
  doi: z.string().nullable().describe("The DOI of the paper"),
})

const zodPage = z.object({
  summary: z.string().describe("A brief summary of the page"),
  type: z.enum(["introduction", "abstract", "related work", "method", "results", "discussion", "conclusion", "other"]).describe("The type of the page"),
  typeContext: z.optional(z.string()).describe("If the type is 'other', this explains what the type should be"),
  number: z.number().describe("The page number"),
});

export const processPages = async ({ paper, model, pages }: {
  paper: Paper,
  model: ChatOpenAI,
  pages: Document<Record<string, any>>[]
}) => {
  return Promise.all(pages.map(async (page: any, index: number) => {
    // Summarise page content to 1 sentence
    const output = await model.call([{
      role: "system",
      content: `What is this page for? Do not mention the paper title or the page number.`,
    }, {
      role: "user",
      content: `${page.pageContent}\n\nThis is page ${index + 1} of ${paper.title}`
    }]);

    return {
      pageContent: page.pageContent,
      metadata: {
        paper: paper.id,
        summary: output.content,
        ...page.metadata,
      }
    }
  }))
};

export const tagPages = async (pages: Document<Record<string, any>>[]) => {
  const metadataTagger = createMetadataTaggerFromZod(zodPage, {
    llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
  });
  return await metadataTagger.transformDocuments(pages);
};

export const processPaper = async ({ paper }: { paper: Paper }) => {
  const fileResults = await db.select().from(files).where(eq(files.id, paper.fileId!));
  if (fileResults.length === 0) {
    console.log(`Paper ${paper.id} has no file!`);
    return;
  }
  const file = fileResults[0];
  // Load the file into the vector store
  const pdf = new PDFLoader(file.path, { splitPages: true });
  const docs = await pdf.load();

  if (paper.abstract === null) {
    // Take first 5 pages and get metadata
    const firstPages = docs.slice(0, 5);
    const taggedPages = await tagPages(firstPages);
    // Find the abstract
    const abstractPage = taggedPages.find(page => page.metadata.type === "abstract");
    if (abstractPage) {
      paper.abstract = abstractPage.metadata.summary;
      await db.update(papers).set({ abstract: paper.abstract }).where(eq(papers.id, paper.id));
      console.log(`Found and updated abstract for ${paper.id}!`);
    } else {
      console.log(`We could not find the abstract for ${paper.id} in the first 5 pages!`);
    }
  }
}