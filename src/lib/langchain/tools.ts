import fs from "fs/promises";
import path from "path";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain, VectorDBQAChain } from "langchain/chains";
import { DynamicTool, ChainTool, Tool } from "langchain/tools";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

import { CLITool } from "./tools/cli";
import { YouTubeTranscribeTool } from "./tools/transcript";

export const getModel = (modelName: string = "gpt-3.5-turbo") => {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName,
    verbose: true,
  });
  return model;
};

export const getVectorStore = async ({ redisClient, indexName, model }: {
  redisClient: RedisClientType,
  indexName: string,
  model: ChatOpenAI
}) => {
  const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
    redisClient,
    indexName,
  });
  const baseCompressor = LLMChainExtractor.fromLLM(model);
  const vectorRetriever = new ContextualCompressionRetriever({
    baseCompressor,
    baseRetriever: vectorStore.asRetriever(),
  });
  const dataChain = RetrievalQAChain.fromLLM(model, vectorRetriever);

  return { vectorStore, dataChain };
};

export const getTools = async ({ model, redisClient }: { model: ChatOpenAI, redisClient: RedisClientType }) => {
  const embeddings = new OpenAIEmbeddings();
  const tools: Tool[] = [
    // Formulate a plan
    new ChainTool({
      name: "todo-list",
      chain: new LLMChain({
        llm: getModel("gpt-4"),
        prompt: PromptTemplate.fromTemplate(
          "You are a planner who is an expert at coming up with a todo list for a given objective. Come up with a todo list for this objective: {objective}"
        ),
      }),
      description:
        "useful for when you need to come up with todo lists. Input: an objective to create a todo list for. Output: a todo list for that objective. Please be very clear what the objective is!",
    }),
    // Recall information
    // new ChainTool({
    //   name: "data-chain",
    //   chain: dataChain,
    //   description: "This is where you can access all your long term memory data. Also known as a Vector Store or Knowledge Graph.",
    // }),
    // Gather new information from the internet
    new WebBrowser({ model, embeddings }),
    // Read and write files
    FileIOTool,
    // Transcribe and query YouTube videos
    new YouTubeTranscribeTool({ model, embeddings }),
    // Download files
    fileDownloadTool,
    // Operate on the shell
    new CLITool({ model, embeddings }),
  ];

  return { tools, model };
};

import fsFileTree from 'fs-file-tree';
const fsFileTreePromise = dirname => new Promise((resolve, reject) => {
  fsFileTree(dirname, {}, (error, tree) => {
    if (error) {
      reject(error);
    } else {
      resolve(tree);
    }
  });
});

const FileIOTool = new DynamicTool({
  name: "fileIOTool",
  description: "A utility to access and modify files, assuming root project directory for unspecified paths. Provide a JSON string with attributes: action (read, write, tree), filePath (file location), and content (file content, for writing only).",
  func: async (input: string, runManager) => {
    try {
      const { action, filePath, content } = JSON.parse(input);
      if (action === "read") {
        return (await fs.readFile(filePath)).toString();
      } else if (action === "write") {
        if (!content) {
          return "Error: No content provided."
        } else {
          await fs.writeFile(filePath, content);
          return "File written successfully.";
        }
      } else if (action === "tree") {
        try {
          const tree = await fsFileTreePromise(filePath);
          return JSON.stringify(tree);
        } catch (error: any) {
          return `Error: ${error.message}`
        }
      } else {
        return "Error: Invalid action. Use 'read' or 'write'."
      }
    } catch (error: any) {
      return `Error: ${error.message} - you probably didn't provide a valid JSON object string.`;
    }
  },
})

import util from 'util'
import { exec } from 'child_process';
import { Stats } from "fs";
import { RedisClientType } from "redis";

const promiseExec = util.promisify(exec);

const fileDownloadTool = new DynamicTool({
  name: "fileDownloadTool",
  description: "A utility to download files. Provide a JSON string with attributes: url (remote file url), filePath (local file destination). By default, download files into the /app/data/downloads directory.",
  func: async (input: string, runManager) => {
    try {
      const { url, filePath } = JSON.parse(input);
      // Check if filePath is an valid path, use the default path instead
      // Find the parent directory of the filePath
      const parentDir = path.dirname(filePath);
      // Check if the parent directory exists
      const parentDirExists = await fs.stat(parentDir).catch(() => false).then((stat: boolean | Stats) => {
        if (typeof stat !== "boolean") {
          return stat.isDirectory()
        }
      });
      // If the parent directory doesn't exist, use the default path with the original file name
      const defaultFilePath = path.join("/app/data/downloads", path.basename(filePath));
      const finalFilePath = parentDirExists ? filePath : defaultFilePath;

      const { stdout, stderr } = await promiseExec(`wget ${url} -O ${finalFilePath}`);
      return `STDOUT: ${stdout}\nSTDERR: ${stderr}`
    } catch (error: any) {
      return `Error: ${error.message} - you probably didn't provide a valid JSON object string.`;
    }
  }
});