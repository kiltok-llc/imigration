import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    messages: convertToModelMessages(messages),
    model: openai('gpt-4o-mini'),
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Encoding': 'none',
      'Content-Type': 'application/octet-stream',
    },
  });
}
