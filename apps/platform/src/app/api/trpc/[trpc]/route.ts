import type { NextRequest } from 'next/server';

import { appRouter } from '@repo/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { env } from '@/env';
import { createServerSupabase } from '@/lib/supabase/server';

const setCorsHeaders = (res: Response) => {
  if (env.NODE_ENV === 'development') {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Request-Method', '*');
    res.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.headers.set('Access-Control-Allow-Headers', '*');
  }
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    // @ts-expect-error supabase-ssr is out of sync with supabase-js
    createContext: async () => ({
      supabase: await createServerSupabase(),
    }),
    endpoint: '/api/trpc',
    onError({ error, path }) {
      console.error(`tRPC Error on '${path}'`, error);
    },
    req,
    router: appRouter,
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
