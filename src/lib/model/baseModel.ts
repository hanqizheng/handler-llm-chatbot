// lib/models/baseModel.ts
import { HumanMessage } from "@langchain/core/messages";

export interface BaseModel {
  stream(inputMessages: HumanMessage[]): Promise<ReadableStream<Uint8Array>>;
}