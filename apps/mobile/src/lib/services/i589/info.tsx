import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { objectPropertyAtomFamily } from '@/atoms/object-property-atom-family';

// Define the schema for the info quiz answers
export const AnswersSchema = z.object({
  aliasName: z.string().optional(),
  firstName: z.string().optional(),
  hasAlias: z.boolean().optional(),
  lastName: z.string().optional(),
  maidenName: z.string().optional(),
  middleName: z.string().optional(),
  otherNames: z.string().optional(),

  birthCity: z.string().optional(),
  birthCountry: z.string().optional(),
  birthNationality: z.string().optional(),
  currentNationality: z.string().optional(),
  dob: z.string().optional(), // Date as string
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  sex: z.enum(['male', 'female']).optional(),

  canReadWriteEnglish: z.boolean().optional(),
  canReadWriteSpanish: z.boolean().optional(),
  nativeLanguage: z.string().optional(),
  otherLanguages: z.string().optional(),
  speaksEnglish: z.boolean().optional(),
  speaksSpanish: z.boolean().optional(),

  livesInUS: z.boolean().optional(),

  apartmentNumber: z.string().optional(),
  city: z.string().optional(),
  hasApartmentUnit: z.boolean().optional(),
  state: z.string().optional(),
  streetAddress: z.string().optional(),
  zipCode: z.string().optional(),

  schoolCity: z.string().optional(),
  schoolCountry: z.string().optional(),
  schoolFrom: z.string().optional(),
  schoolLevel: z
    .enum(['primary', 'secondary', 'technical', 'university'])
    .optional(),
  schoolName: z.string().optional(),
  schoolState: z.string().optional(),
  schoolTo: z.string().optional(),

  employerAddress: z.string().optional(),
  employerCity: z.string().optional(),
  employerCountry: z.string().optional(),
  employerName: z.string().optional(),
  employerState: z.string().optional(),
  occupation: z.string().optional(),
  workFrom: z.string().optional(),
  workTo: z.string().optional(),

  hasChildren: z.boolean().optional(),
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed'])
    .optional(),
  numberOfChildren: z.string().optional(),

  spouseCityMarriage: z.string().optional(),
  spouseCountryMarriage: z.string().optional(),
  spouseFirstName: z.string().optional(),
  spouseLastName: z.string().optional(),
  spouseMarriageDate: z.date().optional(),
  spouseMiddleName: z.string().optional(),

  children: z.array(
    z.object({
      birthCity: z.string().optional(),
      birthCountry: z.string().optional(),
      dob: z.string().optional(), // Date as string
      ethnicity: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      livesInUS: z.boolean().optional(),
      middleName: z.string().optional(),
      nationality: z.string().optional(),
      sex: z.enum(['m', 'f']).optional(),
    })
  ),

  passportCountry: z.string().optional(),
  passportExpiration: z.date().optional(),
  passportNumber: z.string().optional(),

  alienNumber: z.string().optional(),
  hasAlienNumber: z.boolean().optional(),
  hasSSN: z.boolean().optional(),
  hasUSCISAccount: z.boolean().optional(),
  ssn: z.string().optional(),
  uscisAccount: z.string().optional(),

  asylumReasons: z.array(
    z.enum([
      'nationality',
      'political-opinion',
      'race',
      'religion',
      'social-group',
    ])
  ),
  fearOfReturn: z.string().optional(),
  harmDetails: z.string().optional(),

  accusedDetails: z.string().optional(),
  currentParticipationDetails: z.string().optional(),
  hasOrgAssociation: z.boolean().optional(),
  hasReturnedToCountry: z.boolean().optional(),
  orgAssociationDetails: z.string().optional(),
  returnDetails: z.string().optional(),
  stillParticipating: z.boolean().optional(),
  wasAccusedOutsideUS: z.boolean().optional(),

  agreesToDeclaration: z.boolean().optional(),
});

export const answersAtom = atomWithMmkvStorage(
  'services.i589.info.answers',
  {
    asylumReasons: [],
    children: [],
  },
  AnswersSchema
);

export const answerFamily = objectPropertyAtomFamily(answersAtom);
