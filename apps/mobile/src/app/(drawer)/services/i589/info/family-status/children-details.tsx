import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import { forwardRef } from 'react';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizPageHandle, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { numberOfChildrenAtom, userDataAtom } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

type ChildQuizPageProps = {
  index: number;
};

export default function ChildrenDetails() {
  const [numberOfChildren, setNumberOfChildren] = useAtom(numberOfChildrenAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasChildren: null,
        }}
        onSubmit={({ number }) => {
          setNumberOfChildren(number ?? 0);

          return true;
        }}
        pageId='children-information'
        schema={z.object({
          hasChildren: required(z.boolean().nullable()),
          number: z
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

            <ConditionalFormFieldBlock
              active={!!watch('hasChildren')}
              activeValue={'0'}
              control={control}
              name='number'
            >
              <QuizFieldTitle />
              <QuizTextInput inputMode='numeric' />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      {Array.from({ length: numberOfChildren ?? 0 }).map((_, i) => (
        <ChildQuizPage index={i} key={i} />
      ))}
    </QuizScreen>
  );
}

const childFamily = atomFamily((index: number) =>
  focusAtom(userDataAtom, (optic) =>
    optic.prop('children').optional().at(index)
  )
);

const ChildQuizPage = forwardRef<QuizPageHandle, ChildQuizPageProps>(
  function ChildQuizPage({ index }: ChildQuizPageProps, ref) {
    const numberOfChildren = useAtomValue(numberOfChildrenAtom);
    const setChild = useSetAtom(childFamily(index));

    return (
      <QuizPage
        defaultValues={{
          dob: null,
          ethnicity: '',
          hasBirthCertificate: null,
          livesInUsa: null,
          name: DEFAULT_NAME,
          sex: null,
        }}
        onSubmit={({
          birthCertificate,
          dob,
          ethnicity,
          livesInUsa,
          name,
          sex,
        }) => {
          setChild({
            birthCertificate,
            dob,
            ethnicity,
            livesInUsa,
            name,
            sex,
          });

          return true;
        }}
        pageId='child'
        pageKey={index}
        ref={ref}
        schema={z.object({
          birthCertificate: required(z.string().nullable()).optional(),
          dob: required(z.date().nullable()),
          ethnicity: z.string(),
          hasBirthCertificate: required(z.boolean().nullable()),
          livesInUsa: required(z.boolean().nullable()),
          name: NameSchema,
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
                <QuizTextInput optional />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='hasBirthCertificate'>
                <QuizFieldTitle variant='titleLarge' />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasBirthCertificate')}
              activeValue={null}
              control={control}
              name='birthCertificate'
            >
              <QuizFieldTitle />
              <FormImageInput />
            </ConditionalFormFieldBlock>
          </TranslationContextProvider>
        )}
      </QuizPage>
    );
  }
);
