import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormSexInput } from '@/components/ui/form/radio';
import { FormTextInput } from '@/components/ui/form/text';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { SexEnum } from '@/lib/schema/common';
import { nullableInput } from '@/lib/utils';

export default function DemographicsAndBirth() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          dob: '',
          sex: null,
        }}
        onSubmit={() => {
          return true;
        }}
        pageId="basic-demographics"
        schema={z.object({
          dob: z.string().nonempty(),
          sex: nullableInput(SexEnum),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name="sex">
                <QuizFieldTitle />
                <FormSexInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name="dob">
                <QuizFieldTitle />
                <FormTextInput label="Date of Birth" placeholder="MM/DD/YYYY" />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          birthCity: '',
          birthCountry: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId="birth-location"
        schema={z.object({
          birthCity: z.string().min(1, 'City of birth is required'),
          birthCountry: z.string().min(1, 'Country of birth is required'),
        })}
      >
        {({ control }) => (
          <>
            <FormLabel>
              <Trans i18nKey="services.i589.info.personal-information.demographics-and-birth.birth-location-title" />
            </FormLabel>

            <FormField control={control} name="birthCity">
              <FormTextInput label="City of Birth" />
            </FormField>

            <FormField control={control} name="birthCountry">
              <FormTextInput label="Country of Birth" />
            </FormField>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          birthNationality: '',
          currentNationality: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId="nationality"
        schema={z.object({
          birthNationality: z.string().min(1, 'Birth nationality is required'),
          currentNationality: z
            .string()
            .min(1, 'Current nationality is required'),
        })}
      >
        {({ control }) => (
          <>
            <FormLabel>
              <Trans i18nKey="services.i589.info.personal-information.demographics-and-birth.nationality-title" />
            </FormLabel>

            <FormField control={control} name="currentNationality">
              <FormTextInput label="Current Nationality (Citizenship)" />
            </FormField>

            <FormField control={control} name="birthNationality">
              <FormTextInput label="Nationality at Birth" />
            </FormField>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          ethnicity: '',
          religion: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId="additional-info"
        schema={z.object({
          ethnicity: z.string().optional(),
          religion: z.string().optional(),
        })}
      >
        {({ control }) => (
          <>
            <FormLabel>
              <Trans i18nKey="services.i589.info.personal-information.demographics-and-birth.additional-info-title" />
            </FormLabel>

            <FormField control={control} name="ethnicity">
              <FormTextInput label="Race, Ethnicity, or Tribal Group" />
            </FormField>

            <FormField control={control} name="religion">
              <FormTextInput label="Religion" />
            </FormField>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
