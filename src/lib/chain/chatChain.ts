import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { OllamaModel } from "../model/ollamaModel";

export async function initialChatChain() {
  const prompt = PromptTemplate.fromTemplate(
    `Given the detailed information about a comprehensive eldercare platform: {context}
     Summarize this information, including the main services, innovations, and any additional services provided by the platform. 
     Ensure the summary is concise, well-organized, and includes numbered points to enhance readability.
     
     REMEMBER: The summary should be Mandarin Chinese. And only return the summary text.
     `
  );

  const ollamaLlm = new OllamaModel();

  const chain = await createStuffDocumentsChain({
    llm: ollamaLlm.getChatOllama(),
    outputParser: new StringOutputParser(),
    prompt,
  });

  return chain;
}
