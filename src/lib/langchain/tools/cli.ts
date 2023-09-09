import { Tool } from "langchain/tools";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { promiseExec } from "../../os";

const parseInputs = (inputs) => {
  const [baseUrl, task] = inputs.split(",").map(input => {
    let t = input.trim();
    t = t.startsWith('"') ? t.slice(1) : t;
    t = t.endsWith('"') ? t.slice(0, -1) : t;
    return t.trim();
  })
  return [baseUrl, task];
};

export class CLITool extends Tool {
  private model: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  public name;
  public description;
  constructor({ model, embeddings, verbose, callbacks, callbackManager, }) {
    super(verbose, callbacks ?? callbackManager);
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "embeddings", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "cli-tool"
    });
    Object.defineProperty(this, "description", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: `A utility executing command line instructions at the project's root directory within Alpine Linux environment. Make sure all long running tasks are running in the background (screen). You have the following tools installed by default: screen tree git jq curl ffmpeg python3 py3-pip yt-dlp. Input should be a comma separated list of "ONE valid shell command","what you want to find in the output or empty string for a summary".`
    });
    this.model = model;
    this.embeddings = embeddings;
  }
  /** @ignore */
  async _call(inputs, runManager) {
    const [command, task] = parseInputs(inputs);
    const doSummary = !task;
    try {
      const { stdout, stderr } = await promiseExec(command);
      if (stderr) {
        console.log(stderr)
        return `Error: ${stderr}`
      } else {
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 2000,
          chunkOverlap: 200,
        });
        const texts = await textSplitter.splitText(stdout);
        let context;
        // if we want a summary grab first 4
        if (doSummary) {
          context = texts.slice(0, 4).join("\n");
        }
        // search term well embed and grab top 4
        else {
          const docs = texts.map((pageContent) => new Document({
            pageContent,
            metadata: [],
          }));
          const vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
          const results = await vectorStore.similaritySearch(task, 4);
          context = results.map((res) => res.pageContent).join("\n");
        }
        const input = `Text:${context}\n\nI need ${doSummary ? "a summary" : task} from the above command output`;
        return this.model.predict(input, undefined, runManager?.getChild());
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}