import z from 'zod/v4';

import { SchoolLevelEnum } from '@/lib/schemas';

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

export const PassportTypeEnum = z.enum(['passport', 'other']);

export const PassportSchema = z.object({
  country: z.string().default(''),
  expiration: z.date().nullable().default(null),
  number: z.string().default(''),
  type: PassportTypeEnum.default('passport'),
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

export const NativeLanguageSchema = z.object({
  dialect: z.string().default(''),
  language: z.string().default(''),
});

export const DEFAULT_NATIVE_LANGUAGE = NativeLanguageSchema.parse({});

export const JobSchema = z.object({
  address: AddressSchema.default(DEFAULT_ADDRESS),
  employer: z.string().default(''),
  occupation: z.string().default(''),
  range: RangeSchema.default(DEFAULT_RANGE),
});

export const DEFAULT_JOB = JobSchema.parse({});

export const SchoolInfoSchema = z.object({
  address: AddressSchema.default(DEFAULT_ADDRESS),
  level: SchoolLevelEnum.nullable().default(null),
  name: z.string().default(''),
  range: RangeSchema.default(DEFAULT_RANGE),
});

export const DEFAULT_SCHOOL_INFO = SchoolInfoSchema.parse({});
