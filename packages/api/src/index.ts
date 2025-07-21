import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { t } from './trpc';

export const appRouter = t.router({});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export { type TRPCContext } from './trpc';
