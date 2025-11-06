import { UIMessage as VercelUIMessage } from '@ai-sdk/react';
import { InferUITools, tool, ToolSet } from 'ai';
import z from 'zod/v4';

export const dataPartSchema = z.object({
  chip: z.object({
    type: z.enum(['end-interview']),
  }),
});

export const metadataSchema = z.object({
  transient: z.boolean().optional(),
});

const ActionChipTypeEnum = z.enum(['end-interview', 'submit-documents']);

export type ActionChipType = z.infer<typeof ActionChipTypeEnum>;

export const tools = {
  actionChip: tool({
    description: [
      'Create an interactive action chip (button) that users can click to trigger in-app actions.',
      'Use chips AS OFTEN AS POSSIBLE. They MASSIVELY improve the user experience.',
      "Calling this tool will add the specified action chips to the assistant's response.",
      'Types of chips:',
      '- end-interview: Use PROACTIVELY when it seems like the user has no more relevant information to share or they might want to end the interview.',
      '- submit-documents: Use PROACTIVELY when the user might have documents, photos, or screenshots to share that could help their case.',
    ].join('\n'),
    execute: async () => ({}),
    inputSchema: z.object({
      chips: z.array(ActionChipTypeEnum),
    }),
  }),
} satisfies ToolSet;

export type UIMessage = VercelUIMessage<
  z.infer<typeof metadataSchema>,
  z.infer<typeof dataPartSchema>,
  InferUITools<typeof tools>
>;
