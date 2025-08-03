import { useAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormDocumentsInput } from '@/components/form/document';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import {
  QuizFieldDescription,
  QuizPageDescription,
  QuizPageTitle,
} from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizLongTextInput } from '@/components/quiz/text';
import {
  currentOrganizationalAffiliationsDetailsAtom,
  pastOrganizationalAffiliationsDetailsAtom,
} from '@/lib/data/asylum';
import { required } from '@/lib/utils';

export default function OrganizationalAffiliations() {
  const [pastDetails, setPastDetails] = useAtom(
    pastOrganizationalAffiliationsDetailsAtom
  );
  const [currentDetails, setCurrentDetails] = useAtom(
    currentOrganizationalAffiliationsDetailsAtom
  );

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasPastAffiliations: false,
        }}
        onSuccess={({ details }) => {
          setPastDetails(details ?? '');
        }}
        pageId='has-past-affiliations'
        schema={z.object({
          details: z.string().nonempty().optional(),
          hasPastAffiliations: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasPastAffiliations'>
                <QuizFieldDescription />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasPastAffiliations')}
              activeValue=''
              control={control}
              name='details'
            >
              <FormBlock animated>
                <QuizPageTitle />
                <QuizPageDescription />
                <FormField control={control} name='details'>
                  <QuizLongTextInput />
                </FormField>
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>

      {pastDetails !== '' && (
        <QuizPage
          defaultValues={{
            documents: [],
          }}
          onSuccess={() => true}
          pageId='past-affiliations-documents'
          schema={z.object({
            documents: z.array(z.string()),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <FormBlock>
                <QuizPageTitle />
                <QuizPageDescription />
                <FormField control={control} name='documents'>
                  <FormDocumentsInput />
                </FormField>
              </FormBlock>
            </FormBlock>
          )}
        </QuizPage>
      )}

      <QuizPage
        defaultValues={{
          hasCurrentAffiliations: false,
        }}
        onSuccess={({ details }) => {
          setCurrentDetails(details ?? '');
        }}
        pageId='has-current-affiliations'
        schema={z.object({
          details: z.string().nonempty().optional(),
          hasCurrentAffiliations: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasCurrentAffiliations'>
                <QuizFieldDescription />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasCurrentAffiliations')}
              activeValue=''
              control={control}
              name='details'
            >
              <FormBlock animated>
                <QuizPageTitle />
                <QuizPageDescription />
                <FormField control={control} name='details'>
                  <QuizLongTextInput />
                </FormField>
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>

      {currentDetails !== '' && (
        <QuizPage
          defaultValues={{
            documents: [],
          }}
          onSuccess={() => true}
          pageId='current-affiliations-documents'
          schema={z.object({
            documents: z.array(z.string()),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <FormBlock>
                <QuizPageTitle />
                <QuizPageDescription />
                <FormField control={control} name='documents'>
                  <FormDocumentsInput />
                </FormField>
              </FormBlock>
            </FormBlock>
          )}
        </QuizPage>
      )}
    </QuizScreen>
  );
}
