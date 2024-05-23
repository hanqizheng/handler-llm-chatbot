import { NextResponse } from 'next/server';
import { agentHandler } from '@/lib/agent';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log(`Received message: ${message}`);
    const responseMessage = await agentHandler(message);
    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error:', error);
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}