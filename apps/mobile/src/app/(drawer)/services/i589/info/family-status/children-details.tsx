import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import uuid from 'react-native-uuid';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import {
  DEFAULT_FORM_NAME,
  FormNameInput,
  FormNameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizForm } from '@/components/quiz/form';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizPageProps } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import {
  childBirthCertificateAtom,
  childDobAtom,
  childEthnicityAtom,
  childIdsAtom,
  childLivesInUsaAtom,
  childNameAtom,
  childSexAtom,
} from '@/lib/data/child';
import { SexEnum } from '@/lib/data/schema';
import { nameAtom } from '@/lib/data/user';
import { TranslationContextProvider } from '@/lib/translation';
import { required, stretchTo } from '@/lib/utils';

type ChildQuizPageProps = QuizPageProps & {
  id: string;
  index: number;
};

export function ChildQuizPage({
  id,
  index,
  pageId,
  pageRef,
}: ChildQuizPageProps) {
  const numberOfChildren = useAtomValue(childIdsAtom).length;
  const setDob = useSetAtom(childDobAtom(id));
  const setEthnicity = useSetAtom(childEthnicityAtom(id));
  const setBirthCertificate = useSetAtom(childBirthCertificateAtom(id));
  const setLivesInUsa = useSetAtom(childLivesInUsaAtom(id));
  const setSex = useSetAtom(childSexAtom(id));
  const setName = useSetAtom(childNameAtom(id));
  const lastName = useAtomValue(nameAtom).last;

  return (
    <QuizPage pageId={pageId} pageKey={id} pageRef={pageRef}>
      <QuizForm
        defaultValues={{
          dob: null,
          ethnicity: '',
          hasBirthCertificate: null,
          livesInUsa: null,
          name: {
            ...DEFAULT_FORM_NAME,
            last: lastName,
          },
          sex: null,
        }}
        key={id}
        onSuccess={({
          birthCertificate,
          dob,
          ethnicity,
          livesInUsa,
          name,
          sex,
        }) => {
          setDob(dob);
          setEthnicity(ethnicity);
          setBirthCertificate(birthCertificate ?? '');
          setLivesInUsa(livesInUsa);
          setName(name);
          setSex(sex);
        }}
        sampleData={{
          example: {
            dob: new Date('2012-04-10'),
            ethnicity: 'Latino',
            hasBirthCertificate: false,
            livesInUsa: true,
            name: {
              first: 'Alex',
              last: lastName || 'Smith',
              middle: 'Jay',
            },
            sex: 'male',
          },
        }}
        schema={z.object({
          birthCertificate: required(z.string().nullable()).optional(),
          dob: required(z.date().nullable()),
          ethnicity: z.string(),
          hasBirthCertificate: required(z.boolean().nullable()),
          livesInUsa: required(z.boolean().nullable()),
          name: FormNameSchema,
          sex: required(SexEnum.nullable()),
        })}
      >
        {({ control, lens, watch }) => (
          <TranslationContextProvider
            value={{
              context: watch('name.first') ? 'named' : 'unnamed',
              count: index + 1,
              values: {
                name: watch('name.first'),
                ordinal: true,
                total: numberOfChildren,
              },
            }}
          >
            <QuizPageTitle />

            <FormBlock>
              <QuizFieldTitle name='name' variant='titleLarge' />
              <FormNameInput lens={lens.focus('name')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='sex'>
                <QuizFieldTitle variant='titleLarge' />
                <FormSexInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='dob'>
                <QuizFieldTitle variant='titleLarge' />
                <QuizDateInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='livesInUsa'>
                <QuizFieldTitle variant='titleLarge' />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='ethnicity'>
                <QuizFieldTitle variant='titleLarge' />
                <QuizTextInput hint='optional' />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='hasBirthCertificate'>
                <QuizFieldTitle variant='titleLarge' />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasBirthCertificate')}
              activeValue={null}
              control={control}
              name='birthCertificate'
            >
              <FormBlock animated>
                <QuizFieldTitle />
                <FormImageInput />
              </FormBlock>
            </ConditionalFormWrapper>
          </TranslationContextProvider>
        )}
      </QuizForm>
    </QuizPage>
  );
}

export default function ChildrenDetails() {
  const [childIds, setChildIds] = useAtom(childIdsAtom);

  return (
    <QuizScreen>
      <QuizPage pageId='children-information'>
        <QuizForm
          defaultValues={{
            hasChildren: null,
          }}
          onSuccess={({ numChildren }) => {
            setChildIds(stretchTo(childIds, numChildren ?? 0, () => uuid.v4()));
          }}
          sampleData={{
            example: {
              hasChildren: true,
              numChildren: '2',
            },
          }}
          schema={z.object({
            hasChildren: required(z.boolean().nullable()),
            numChildren: z
              .string()
              // .regex(/^\d+$/)
              .pipe(z.coerce.number<string>().int().positive())
              .optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasChildren'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormWrapper
                active={!!watch('hasChildren')}
                activeValue={'0'}
                control={control}
                name='numChildren'
              >
                <FormBlock animated>
                  <QuizFieldTitle />
                  <QuizTextInput inputMode='numeric' />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizForm>
      </QuizPage>

      {childIds.map((id, index) => (
        <ChildQuizPage id={id} index={index} key={id} pageId='child' />
      ))}
    </QuizScreen>
  );
}
