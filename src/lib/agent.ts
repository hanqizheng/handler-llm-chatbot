import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";
import { removeEmoji } from "../util";

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

export const agentHandler = async (message: string) => {
  const chatOllama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
  });

  const inputMessages = [new HumanMessage({ content: message })];

  const responseStream = await chatOllama.stream(inputMessages, {});

  const stream = new ReadableStream({
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

  return stream;
};