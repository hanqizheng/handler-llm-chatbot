import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { initialHtmlLoader } from '@/lib/documentLoader/webLoader';
import { splitText } from '../splitter/jsonDataSplitter';

const initializeRAG = async () => {
  try {
    const loader = await initialHtmlLoader();
    const data = await loader.load();
    const splits = await splitText(data);

    // Ensure the API endpoint is correct
    const ollamaEmbeddings = new OllamaEmbeddings();
    console.log('Using Ollama API endpoint:', ollamaEmbeddings);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      ollamaEmbeddings
    );

    const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });
    const retrievedDocs = await retriever.invoke('春座');

    console.log('retrievedDocs:', retrievedDocs);
    return retrievedDocs;
  } catch (error) {
    console.error('Error initializing RAG:', error);
  }
};

export default initializeRAG;