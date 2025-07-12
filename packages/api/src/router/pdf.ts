import type { TRPCRouterRecord } from '@trpc/server';

import { z } from 'zod/v4';

import { publicProcedure } from '../trpc';
import { raiseStatus } from '../utils';

export const pdf = {
  generate: publicProcedure
    .input(
      z.object({
        documentId: z.uuid(),
        variables: z.any(),
      })
    )
    .mutation(
      async ({
        ctx: { supabase },
        input: { documentId, variables: _variables },
      }) => {
        const {
          data: { generatedFields: _generatedFields },
        } = await supabase
          .from('documents')
          .select(`generatedFields:generated_fields`)
          .eq('id', documentId)
          .single()
          .throwOnError();

        const {
          data: { publicUrl },
        } = supabase.storage
          .from('documents')
          .getPublicUrl(`${documentId}.pdf`);

        const _buffer = await fetch(publicUrl)
          .then(raiseStatus)
          .then((res) => res.blob())
          .then((blob) => blob.arrayBuffer());

        // TODO load and render out pdf
        const base64 = '';

        return base64;
      }
    ),
} satisfies TRPCRouterRecord;
