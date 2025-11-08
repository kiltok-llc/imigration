import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  DownloadError,
  stepCountIs,
  streamText,
  UIMessage,
} from 'ai';

import { env } from '@/env';
import { tools } from '@/lib/chat/schema';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    experimental_download: async (urls) =>
      await Promise.all(
        urls.map(async ({ isUrlSupportedByModel, url }) => {
          if (
            url.origin === env.EXPO_PUBLIC_SUPABASE_URL &&
            req.headers.has('Authorization')
          ) {
            // Authenticate requests to supabase storage with the caller's key
            return download({
              headers: {
                authorization: req.headers.get('Authorization')!,
              },
              url,
            });
          }

          return isUrlSupportedByModel ? null : download({ url });
        })
      ),
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

// adapted from:
// https://github.com/vercel/ai/blob/e04dcf50ebc9315d880eeb1b783bae2cf2152aa1/packages/ai/src/util/download/download.ts
export const download = async ({
  headers,
  url,
}: {
  headers?: HeadersInit;
  url: URL;
}) => {
  const urlText = url.toString();
  try {
    const response = await fetch(urlText, { headers });

    if (!response.ok) {
      throw new DownloadError({
        statusCode: response.status,
        statusText: response.statusText,
        url: urlText,
      });
    }

    return {
      data: new Uint8Array(await response.arrayBuffer()),
      mediaType: response.headers.get('Content-Type') ?? undefined,
    };
  } catch (error) {
    if (DownloadError.isInstance(error)) {
      throw error;
    }

    throw new DownloadError({ cause: error, url: urlText });
  }
};
