import { NextResponse } from 'next/server';
import { chatAgentHandler } from '@/lib/agent/chat';
import initializeRAG from '@/lib/agent/rag';

export async function POST(request: Request) {
  try {
    const ragData = await initializeRAG();

    const { message } = await request.json();
    const stream = await chatAgentHandler(message);
    return new NextResponse(stream, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: '有错误发生！请重试。' }, { status: 500 });
  }
}