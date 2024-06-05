import { NextResponse } from 'next/server';
import { agentHandler } from '@/lib/agent';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const stream = await agentHandler(message);
    return new NextResponse(stream, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: '有错误发生！请重试。' }, { status: 500 });
  }
}