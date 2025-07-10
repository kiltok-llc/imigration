import z from 'zod/v4';

export const FieldTypeSchema = z.enum([
  'button',
  'checkbox',
  'dropdown',
  'select',
  'text',
  'radio',
  'signature',
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const GeneratedField = z.object({
  expression: z.string(),
  label: z.string(),
  name: z.string().nonempty(),
  type: FieldTypeSchema,
});

export const GeneratedFieldsSchema = z.array(GeneratedField);
