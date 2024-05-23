import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";
import data from "./data.json"; // 假设数据被存储在一个 JSON 文件中

let vectorStore: MemoryVectorStore | null = null;

export const initializeEmbedding = async () => {
  console.log("Initializing embedding store...");
  const embeddings = new OllamaEmbeddings({
    model: "llama3",
    baseUrl: "http://localhost:11434",
  });

  const allDocs: Document[] = [];

  data.featured_nursing_homes.forEach((home) => {
    allDocs.push({
      pageContent: `养老院名称: ${home.name} \n 养老院所在城市: ${home.location} \n 区："${home.area} \n "价格: ${home.price_range}`,
      metadata: { type: "养老院", id: home.name },
    });
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });

  const allSplits = await textSplitter.splitDocuments(allDocs);
  console.log(`Total splits: ${allSplits.length}`);

  vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings);

  console.log("Embedding store initialized.");
  return vectorStore;
};

const relevantKeywords = ["养老院", "养老院价格", "养老院所在地点"];

const containsRelevantKeywords = (message: string) => {
  return relevantKeywords.some((keyword) => message.includes(keyword));
};

export const agentHandler = async (message: string) => {
  if (!vectorStore) {
    vectorStore = await initializeEmbedding();
  }

  if (containsRelevantKeywords(message)) {
    console.log("Relevant keywords detected, performing similarity search...");
    const searchResults = await vectorStore.similaritySearch(message);

    if (searchResults.length > 0) {
      console.log("Similarity search successful, returning relevant document.");
      return searchResults.map((item) => {
        return item.pageContent + '\n';
      })
    }
  }

  console.log("No relevant keywords detected, using AI model for response.");
  const chatOllama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
  });
  const response = await chatOllama.invoke([
    new HumanMessage({ content: message }),
  ]);
  console.log("response: ", response);
  return response.text;
};
