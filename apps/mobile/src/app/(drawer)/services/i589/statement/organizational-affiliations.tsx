import { useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { FormBlock } from '@/components/form/block';
import { FormDocumentsInput } from '@/components/form/document';
import { FormField } from '@/components/form/field';
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
import { appStorage } from '@/lib/mmkv';
import { required } from '@/lib/utils';

const showPastDetailsAtom = atomWithMmkvStorage(
  'organizational-affiliations.show-past-details',
  false,
  z.boolean(),
  appStorage
);

const showCurrentDetailsAtom = atomWithMmkvStorage(
  'organizational-affiliations.show-current-details',
  false,
  z.boolean(),
  appStorage
);

export default function OrganizationalAffiliations() {
  const [showPastDetails, setShowPastDetails] = useAtom(showPastDetailsAtom);
  const [showCurrentDetails, setShowCurrentDetails] = useAtom(
    showCurrentDetailsAtom
  );
  const setPastOrganizationalAffiliationsDetails = useSetAtom(
    pastOrganizationalAffiliationsDetailsAtom
  );
  const setCurrentOrganizationalAffiliationsDetails = useSetAtom(
    currentOrganizationalAffiliationsDetailsAtom
  );

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasPastOrganizationalAffiliations: false,
        }}
        onSubmit={({ hasPastOrganizationalAffiliations }) => {
          setShowPastDetails(hasPastOrganizationalAffiliations);
          if (!hasPastOrganizationalAffiliations) {
            setPastOrganizationalAffiliationsDetails('');
          }
          return true;
        }}
        pageId='has-past-organizational-affiliations'
        schema={z.object({
          hasPastOrganizationalAffiliations: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField
              control={control}
              name='hasPastOrganizationalAffiliations'
            >
              <QuizFieldDescription />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      {showPastDetails && (
        <QuizPage
          defaultValues={{
            details: '',
          }}
          onSubmit={({ details }) => {
            setPastOrganizationalAffiliationsDetails(details);
            return true;
          }}
          pageId='past-affiliations-details'
          schema={z.object({
            details: z.string().nonempty(),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
              <FormField control={control} name='details'>
                <QuizLongTextInput />
              </FormField>
            </FormBlock>
          )}
        </QuizPage>
      )}

      {showPastDetails && (
        <QuizPage
          defaultValues={{
            documents: [],
          }}
          onSubmit={() => true}
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
          hasCurrentOrganizationalAffiliations: false,
        }}
        onSubmit={({ hasCurrentOrganizationalAffiliations }) => {
          setShowCurrentDetails(hasCurrentOrganizationalAffiliations);
          if (!hasCurrentOrganizationalAffiliations) {
            setCurrentOrganizationalAffiliationsDetails('');
          }
          return true;
        }}
        pageId='has-current-organizational-affiliations'
        schema={z.object({
          hasCurrentOrganizationalAffiliations: required(
            z.boolean().nullable()
          ),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField
              control={control}
              name='hasCurrentOrganizationalAffiliations'
            >
              <QuizFieldDescription />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      {showCurrentDetails && (
        <QuizPage
          defaultValues={{
            details: '',
          }}
          onSubmit={({ details }) => {
            setCurrentOrganizationalAffiliationsDetails(details);
            return true;
          }}
          pageId='current-affiliations-details'
          schema={z.object({
            details: z.string().nonempty(),
          })}
        >
          {({ control }) => (
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
              <FormField control={control} name='details'>
                <QuizLongTextInput />
              </FormField>
            </FormBlock>
          )}
        </QuizPage>
      )}

      {showCurrentDetails && (
        <QuizPage
          defaultValues={{
            documents: [],
          }}
          onSubmit={() => true}
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
