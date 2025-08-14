import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { required } from '@/lib/utils';

export default function OtherIdentification() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasDriversLicense: null,
        }}
        onSubmit={() => true}
        pageId='has-drivers-license'
        schema={z.object({
          hasDriversLicense: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasDriversLicense'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          driversLicenseNumber: '',
          driversLicenseState: '',
        }}
        onSubmit={() => true}
        pageId='drivers-license-details'
        schema={z.object({
          driversLicenseNumber: z.string().nonempty(),
          driversLicenseState: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='driversLicenseNumber'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='driversLicenseState'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasSocialSecurity: null,
        }}
        onSubmit={() => true}
        pageId='has-social-security'
        schema={z.object({
          hasSocialSecurity: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasSocialSecurity'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          socialSecurityNumber: '',
        }}
        onSubmit={() => true}
        pageId='social-security-details'
        schema={z.object({
          socialSecurityNumber: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='socialSecurityNumber'>
              <QuizFieldTitle />
              <QuizTextInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
