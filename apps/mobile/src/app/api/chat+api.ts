import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';

import { tools } from '@/lib/chat/schema';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openai('gpt-4o-mini'),
    stopWhen: stepCountIs(10),
    tools,
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Encoding': 'none',
      'Content-Type': 'application/octet-stream',
    },
  });
}
