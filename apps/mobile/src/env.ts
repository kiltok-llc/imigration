import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export const env = createEnv({
  client: {
    EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.coerce
      .number()
      .min(0)
      .max(1)
      .optional(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().nonempty(),
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
    APP_VARIANT: process.env.APP_VARIANT,
    EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE:
      process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_TRPC_URL: process.env.EXPO_PUBLIC_TRPC_URL,
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  },
  server: {
    APP_VARIANT: z.enum(['development', 'staging', 'production']),
    SENTRY_AUTH_TOKEN: z.string().nonempty().optional(),
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
