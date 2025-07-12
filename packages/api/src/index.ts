import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { pdf } from './router/pdf';
import { t } from './trpc';

export const appRouter = t.router({
  pdf,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export { type TRPCContext } from './trpc';
