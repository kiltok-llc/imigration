import { UIMessage as VercelUIMessage } from '@ai-sdk/react';
import { InferUITools, ToolSet } from 'ai';
import z from 'zod/v4';

export const dataPartSchema = z.object({
  chip: z.object({
    type: z.enum(['end-interview']),
  }),
});

export const metadataSchema = z.object({});

export const tools = {} satisfies ToolSet;

export type UIMessage = VercelUIMessage<
  z.infer<typeof metadataSchema>,
  z.infer<typeof dataPartSchema>,
  InferUITools<typeof tools>
>;
