import path from "path";
import { getRedisClient } from "../redis";
import { getTools, getVectorStore } from "./tools";

import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

import { BabyAGI } from "langchain/experimental/babyagi";
import { AutoGPT } from "langchain/experimental/autogpt";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

import * as fs from "fs/promises";

export const getAllFiles = async (dirPath: string) => {
  const files = await fs.readdir(dirPath);
  let allFiles: string[] = [];
  await Promise.all(files.map(async (file) => {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      allFiles = allFiles.concat(await getAllFiles(filePath));
    } else if (stats.isFile()) {
      allFiles.push(filePath);
    }
  }));
  return allFiles;
};

export const loadDataFromDir = async (index: string, directory: string) => {
  const client = getRedisClient();
  await client.connect();

  const loader = new DirectoryLoader(
    directory,
    {
      ".json": (path) => new JSONLoader(path, "/texts"),
      ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
      ".txt": (path) => new TextLoader(path),
      ".csv": (path) => new CSVLoader(path, "text"),
      ".pdf": (path) => new PDFLoader(path, { splitPages: true }),
    }
  );
  const docs = await loader.load();

  console.log(docs)

  if (docs.length > 0) {
    const vectorStore = await RedisVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        redisClient: client,
        indexName: index,
      }
    ).then(async vectorStore => {
      await client.quit();
      return vectorStore;
    })

    return { vectorStore, client };
  } else {
    await client.quit();
    return null;
  }
};

export const useVectorStore = async (index: string, query: string) => {
  const client = getRedisClient();
  await client.connect();

  try {
    const { dataChain } = await getVectorStore({ redisClient: client, indexName: index });
    const res = await dataChain.call({
      query,
    });
    await client.quit();
    return res;
  } catch (error) {
    console.log(error);
  }

  await client.quit();
  return null;
};

export const useAgent = async (query: string, type: "zero-shot-react-description" | "chat-zero-shot-react-description" | "chat-conversational-react-description" = "zero-shot-react-description", keepAlive: boolean = false) => {
  const client = getRedisClient();
  await client.connect();

  const { tools, model } = await getTools({ redisClient: client });

  const executor = await initializeAgentExecutorWithOptions(
    tools,
    model,
    {
      agentType: type
    },
  );
  console.log("Loaded agent.");
  if (!keepAlive) await client.quit();
  return executor;
};

export const queryBabyAGI = async (objective: string) => {
  const client = getRedisClient();
  await client.connect();
  const { tools, model } = await getTools({ redisClient: client });
  const agentExecutor = await initializeAgentExecutorWithOptions(
    tools,
    model,
    {
      agentType: "zero-shot-react-description",
      agentArgs: {
        prefix: `You are an AI who performs one task based on the following objective: {objective}. Take into account these previously completed tasks: {context}.`,
        suffix: `Question: {task}
  {agent_scratchpad}`,
        inputVariables: ["objective", "task", "context", "agent_scratchpad"],
      },
    }
  );

  const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
    redisClient: client,
    indexName: "data",
  });

  // Then, we create a BabyAGI instance.
  const babyAGI = BabyAGI.fromLLM({
    llm: model,
    executionChain: agentExecutor, // an agent executor is a chain
    vectorstore: vectorStore,
    maxIterations: 10,
  });

  await babyAGI.call({ objective }).then(async res => {
    await client.quit();
    return res;
  });
};

export const queryAutoGPT = async (query: string) => {
  const client = getRedisClient();
  await client.connect();
  const { tools, model } = await getTools({ redisClient: client });

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  const autogpt = AutoGPT.fromLLMAndTools(
    model,
    tools,
    {
      memory: vectorStore.asRetriever(),
      aiName: "AutoGPT",
      aiRole: "Assistant"
    }
  );

  await autogpt.run([query]).then(async res => {
    await client.quit();
    return res;
  });
};

const OPEN_METEO_DOCS = `
BASE URL: https://api.open-meteo.com/

API Documentation
The API endpoint /v1/forecast accepts a geographical coordinate, a list of weather variables and responds with a JSON hourly weather forecast for 7 days. Time always starts at 0:00 today and contains 168 hours. All URL parameters are listed below:

Parameter	Format	Required	Default	Description
latitude, longitude	Floating point	Yes		Geographical WGS84 coordinate of the location
hourly	String array	No		A list of weather variables which should be returned. Values can be comma separated, or multiple &hourly= parameter in the URL can be used.
daily	String array	No		A list of daily weather variable aggregations which should be returned. Values can be comma separated, or multiple &daily= parameter in the URL can be used. If daily weather variables are specified, parameter timezone is required.
current_weather	Bool	No	false	Include current weather conditions in the JSON output.
temperature_unit	String	No	celsius	If fahrenheit is set, all temperature values are converted to Fahrenheit.
windspeed_unit	String	No	kmh	Other wind speed speed units: ms, mph and kn
precipitation_unit	String	No	mm	Other precipitation amount units: inch
timeformat	String	No	iso8601	If format unixtime is selected, all time values are returned in UNIX epoch time in seconds. Please note that all timestamp are in GMT+0! For daily values with unix timestamps, please apply utc_offset_seconds again to get the correct date.
timezone	String	No	GMT	If timezone is set, all timestamps are returned as local-time and data is returned starting at 00:00 local-time. Any time zone name from the time zone database is supported. If auto is set as a time zone, the coordinates will be automatically resolved to the local time zone.
past_days	Integer (0-2)	No	0	If past_days is set, yesterday or the day before yesterday data are also returned.
start_date
end_date	String (yyyy-mm-dd)	No		The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
models	String array	No	auto	Manually select one or more weather models. Per default, the best suitable weather models will be combined.

Variable	Valid time	Unit	Description
temperature_2m	Instant	°C (°F)	Air temperature at 2 meters above ground
snowfall	Preceding hour sum	cm (inch)	Snowfall amount of the preceding hour in centimeters. For the water equivalent in millimeter, divide by 7. E.g. 7 cm snow = 10 mm precipitation water equivalent
rain	Preceding hour sum	mm (inch)	Rain from large scale weather systems of the preceding hour in millimeter
showers	Preceding hour sum	mm (inch)	Showers from convective precipitation in millimeters from the preceding hour
weathercode	Instant	WMO code	Weather condition as a numeric code. Follow WMO weather interpretation codes. See table below for details.
snow_depth	Instant	meters	Snow depth on the ground
freezinglevel_height	Instant	meters	Altitude above sea level of the 0°C level
visibility	Instant	meters	Viewing distance in meters. Influenced by low clouds, humidity and aerosols. Maximum visibility is approximately 24 km.`;