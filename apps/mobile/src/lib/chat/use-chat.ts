import { UseChatOptions, useChat as useVercelChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

import { env } from '@/env';
import { UIMessage } from '@/lib/chat/schema';

export const useChat = (options: UseChatOptions<UIMessage>) =>
  useVercelChat({
    onError: (error) => console.error(error),
    transport: new DefaultChatTransport({
      api: `${env.EXPO_PUBLIC_API_BASE_URL}/api/chat`,
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    }),
    ...options,
  });
