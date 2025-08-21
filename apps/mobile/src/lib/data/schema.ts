import z from 'zod/v4';

export const AlienNumberSchema = z.string();

export const DEFAULT_ALIEN_NUMBER = '';

export const UscisNumberSchema = z.string();

export const DEFAULT_USCIS_NUMBER = '';

export const SsnSchema = z.string();

export const DEFAULT_SSN = '';

export const RangeSchema = z.object({
  end: z.date().nullable().default(null),
  start: z.date().nullable().default(null),
});

export const DEFAULT_RANGE = RangeSchema.parse({});

export const LocationSchema = z.object({
  city: z.string().default(''),
  country: z.string().default(''),
});

export const DEFAULT_LOCATION = LocationSchema.parse({});

export const AddressSchema = z.object({
  city: z.string().default(''),
  country: z.string().default(''),
  state: z.string().default(''),
  street: z.string().default(''),
  unit: z.string().default(''),
  zipCode: z.string().default(''),
});

export const DEFAULT_ADDRESS = AddressSchema.parse({});

export const PassportSchema = z.object({
  country: z.string().default(''),
  number: z.string().default(''),
});

export const DEFAULT_PASSPORT = PassportSchema.parse({});

export const NameSchema = z.object({
  first: z.string().default(''),
  last: z.string().default(''),
  middle: z.string().default(''),
});

export const DEFAULT_NAME = NameSchema.parse({});

export const UsaEntrySchema = z.object({
  date: z.date().nullable().default(null),
  port: z.string().default(''),
  status: z.string().default(''),
});

export const DEFAULT_USA_ENTRY = UsaEntrySchema.parse({});
