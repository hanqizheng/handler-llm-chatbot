import "cheerio";

import type { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import data from './data.json'; // 假设数据被存储在一个 JSON 文件中

export const initializeEmbedding = async () => {
  const embeddings = new OllamaEmbeddings({
    model: "llama3",
    baseUrl: "http://localhost:11434",
  });

  const allDocs: Document[] = [];

  data.featured_nursing_homes.forEach((home) => {
    allDocs.push({
      pageContent: `养老院名称: ${home.name} \n 养老院所在城市: ${home.location} \n 区："${home.area} \n "价格: ${home.price_range}`,
      metadata: { type: '养老院', id: home.name },
    });
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });

  const allSplits = await textSplitter.splitDocuments(allDocs);

  const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings);

  return vectorStore;
};