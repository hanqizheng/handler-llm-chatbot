import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from '@langchain/core/documents';

export async function splitText(doc: Document<Record<string, any>>[]) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const allSplits = await textSplitter.splitDocuments(doc);
  return allSplits;
}