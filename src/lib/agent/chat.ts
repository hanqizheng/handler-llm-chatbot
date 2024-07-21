// lib/agent.ts
import { HumanMessage } from "@langchain/core/messages";

import { BaseModel } from "@/lib/model/baseModel";
import { OllamaModel } from "@/lib/model/ollamaModel";
import initializeRAG from "@/lib/agent/rag";

// 根据需要切换模型
export const model: BaseModel = new OllamaModel(); // 可以动态替换成其他模型

export const chatAgentHandler = async (message: string) => {
  const inputMessages = [new HumanMessage({ content: message })];

  const ragData = await initializeRAG(message);

  
  const responseStream = await model.stream(inputMessages);
  return responseStream;
};