import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { initialHtmlLoader } from "@/lib/documentLoader/webLoader";
import { responseTemplate, defaultResponse } from "@/lib/template/prompt";
import { initialChatChain } from "../chain/chatChain";

import { splitText } from "../splitter/jsonDataSplitter";

async function initializeRAG(message: string) {
  try {
    // 读取网页数据
    const loader = await initialHtmlLoader();
    const data = await loader.load();
    const splits = await splitText(data);
    // 生成网页数据对应的向量存储
    const ollamaEmbeddings = new OllamaEmbeddings({
      model: "llama3",
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      ollamaEmbeddings
    );

    // 通过相似度搜索找到与输入问题最相似的文档
    // TODO: 这里的输入问题应该是用户输入的问题
    const searchDocs = vectorStore.similaritySearch(message);
    console.log(
      "searchDocs: ",
      (await searchDocs).map((doc) => doc.pageContent)
    );

    // 通过 chain 将搜索到的文档进行总结归纳，并且生成回答
    const chain = await initialChatChain();

    const response = await chain.invoke({
      context: searchDocs,
    });

    return response;
  } catch (error) {
    console.error("Error initializing RAG:", error);
  }
}

export default initializeRAG;
