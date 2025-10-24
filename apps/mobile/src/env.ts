import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export const env = createEnv({
  client: {
    EXPO_PUBLIC_GIT_COMMIT_HASH: z.string().optional(),
    EXPO_PUBLIC_SENTRY_ENVIRONMENT: z.string().optional(),
    EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.coerce
      .number()
      .min(0)
      .max(1)
      .optional(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    EXPO_PUBLIC_SUPABASE_URL: z.url(),
    EXPO_PUBLIC_TRPC_URL: z.url(),
  },
  clientPrefix: 'EXPO_PUBLIC_',
  extends: [],
  /**
   * Destructure all environment variables here so that Expo can include them in
   * the build.
   */
  runtimeEnvStrict: {
    EXPO_PUBLIC_GIT_COMMIT_HASH: process.env.EXPO_PUBLIC_GIT_COMMIT_HASH,
    EXPO_PUBLIC_SENTRY_ENVIRONMENT: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,
    EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE:
      process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_TRPC_URL: process.env.EXPO_PUBLIC_TRPC_URL,
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  server: {
    OPENAI_API_KEY: z.string().nonempty(),
  },
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  skipValidation: ['build:check', 'lint', 'lint:check'].includes(
    process.env.npm_lifecycle_event ?? ''
  ),
});
