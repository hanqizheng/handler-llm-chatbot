// lib/agent.ts
import { HumanMessage } from "@langchain/core/messages";
import { BaseModel } from "./model/baseModel";
import { OllamaModel } from "./model/ollamaModel";

// 根据需要切换模型
const model: BaseModel = new OllamaModel(); // 可以动态替换成其他模型

export const agentHandler = async (message: string) => {
  const inputMessages = [new HumanMessage({ content: message })];
  const responseStream = await model.stream(inputMessages);
  return responseStream;
};