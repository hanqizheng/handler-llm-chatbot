// lib/models/ollamaModel.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";

import { removeEmoji } from "@/util";

import { BaseModel } from "./baseModel";

export class OllamaModel implements BaseModel {
  private chatOllama: ChatOllama;

  constructor() {
    this.chatOllama = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: "llama3",
    });
  }

  async stream(inputMessages: HumanMessage[]): Promise<ReadableStream<Uint8Array>> {
    const responseStream = await this.chatOllama.stream(inputMessages, {});

    return new ReadableStream({
      async start(controller) {
        const reader = responseStream.getReader();
        const encoder = new TextEncoder();

        async function read() {
          try {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              return;
            }

            let responseText = extractTextFromContent(value.content);
            responseText = removeEmoji(responseText); // 过滤掉emoji

            controller.enqueue(encoder.encode(responseText));
            read(); // Continue reading
          } catch (error) {
            controller.error(error);
          }
        }

        read();
      },
    });
  }
}

// 处理不同类型的 MessageContent
function extractTextFromContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') {
        return item;
      }
      // 处理 MessageContentComplex 类型
      if (item.type === 'complex' && item.parts) {
        return item.parts.map((part: any) => part.text || "").join(" ");
      }
      // 处理 MessageContentImageUrl 类型
      if (item.type === 'image' && item.url) {
        return `[Image: ${item.url}]`;  // Placeholder for image URLs
      }
      return "";
    }).join(" ");
  }
  return "";
}