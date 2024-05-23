import { NextResponse } from 'next/server';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const ollamaLlm = new ChatOllama({
  baseUrl: 'http://localhost:11434',
  model: 'llama3',
});

export async function POST(request: Request) {
  try {
    const { message, messageQueue } = await request.json();
    const messageHistory = messageQueue.map((msg: { type: string; text: string }) => 
      msg.type === 'user' ? new HumanMessage({ content: msg.text }) : new AIMessage({ content: msg.text })
    );

    const response = await ollamaLlm.invoke([...messageHistory, new HumanMessage({ content: message })]);
    return NextResponse.json({ message: response.text });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}