import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage } from "@langchain/core/messages";

import { removeEmoji } from "../util";

export const agentHandler = async (message: string) => {
  const chatOllama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
  });
  const response = await chatOllama.invoke([
    new HumanMessage({ content: message }),
  ]);

  let responseText = response.text;
  responseText = removeEmoji(responseText); // 过滤掉emoji

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;
      function push() {
        if (index < responseText.length) {
          controller.enqueue(new TextEncoder().encode(responseText[index]));
          index++;
          setTimeout(push, 50); // 调整回复速度
        } else {
          controller.close();
        }
      }
      push();
    },
  });

  return stream;
};
