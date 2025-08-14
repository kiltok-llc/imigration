import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { required } from '@/lib/utils';

export default function LegalAndAffiliations() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasArrestHistory: null,
        }}
        onSubmit={() => true}
        pageId='arrest-history'
        schema={z.object({
          hasArrestHistory: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasArrestHistory'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          arrestDetails: '',
        }}
        onSubmit={() => true}
        pageId='arrest-details'
        schema={z.object({
          arrestDetails: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='arrestDetails'>
              <QuizFieldTitle />
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasMilitaryService: null,
        }}
        onSubmit={() => true}
        pageId='military-service'
        schema={z.object({
          hasMilitaryService: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasMilitaryService'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          militaryDetails: '',
        }}
        onSubmit={() => true}
        pageId='military-details'
        schema={z.object({
          militaryDetails: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='militaryDetails'>
              <QuizFieldTitle />
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasOrganizationMembership: null,
        }}
        onSubmit={() => true}
        pageId='organization-membership'
        schema={z.object({
          hasOrganizationMembership: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasOrganizationMembership'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          organizationDetails: '',
        }}
        onSubmit={() => true}
        pageId='organization-details'
        schema={z.object({
          organizationDetails: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='organizationDetails'>
              <QuizFieldTitle />
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasPoliticalAffiliation: null,
        }}
        onSubmit={() => true}
        pageId='political-affiliation'
        schema={z.object({
          hasPoliticalAffiliation: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasPoliticalAffiliation'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          politicalDetails: '',
        }}
        onSubmit={() => true}
        pageId='political-details'
        schema={z.object({
          politicalDetails: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='politicalDetails'>
              <QuizFieldTitle />
              <QuizTextInput multiline />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
