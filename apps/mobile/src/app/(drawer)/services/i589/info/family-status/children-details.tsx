import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { forwardRef } from 'react';
import uuid from 'react-native-uuid';
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
import { QuizPage, QuizPageHandle } from '@/components/quiz/page';
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
import { nameAtom } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required, stretchTo } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

type ChildQuizPageProps = {
  id: string;
  index: number;
};

export default function ChildrenDetails() {
  const [childIds, setChildIds] = useAtom(childIdsAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasChildren: null,
        }}
        onSubmit={({ numChildren }) => {
          setChildIds(stretchTo(childIds, numChildren ?? 0, () => uuid.v4()));

          return true;
        }}
        pageId='children-information'
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

            <ConditionalFormFieldBlock
              active={!!watch('hasChildren')}
              activeValue={'0'}
              control={control}
              name='numChildren'
            >
              <QuizFieldTitle />
              <QuizTextInput inputMode='numeric' />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      {childIds.map((id, index) => (
        <ChildQuizPage id={id} index={index} key={id} />
      ))}
    </QuizScreen>
  );
}

const ChildQuizPage = forwardRef<QuizPageHandle, ChildQuizPageProps>(
  function ChildQuizPage({ id, index }, ref) {
    const numberOfChildren = useAtomValue(childIdsAtom).length;
    const setDob = useSetAtom(childDobAtom(id));
    const setEthnicity = useSetAtom(childEthnicityAtom(id));
    const setBirthCertificate = useSetAtom(childBirthCertificateAtom(id));
    const setLivesInUsa = useSetAtom(childLivesInUsaAtom(id));
    const setSex = useSetAtom(childSexAtom(id));
    const setName = useSetAtom(childNameAtom(id));
    const lastName = useAtomValue(nameAtom).last;

    return (
      <QuizPage
        defaultValues={{
          dob: null,
          ethnicity: '',
          hasBirthCertificate: null,
          livesInUsa: null,
          name: {
            ...DEFAULT_NAME,
            last: lastName,
          },
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
          setDob(dob);
          setEthnicity(ethnicity);
          setBirthCertificate(birthCertificate ?? '');
          setLivesInUsa(livesInUsa);
          setName(name);
          setSex(sex);

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
