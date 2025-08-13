import z from 'zod/v4';

export const SexEnum = z.enum(['male', 'female']);

export const SchoolLevelEnum = z.enum([
  'primary',
  'secondary',
  'vocational',
  'university',
]);

export const MaritalStatusEnum = z.enum([
  'single',
  'married',
  'divorced',
  'widowed',
]);
