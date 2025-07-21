import z from 'zod/v4';

const _PersonalInfoSchema = z.object({
  dateOfBirth: z.date(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  middleName: z.date(),
});
