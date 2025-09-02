import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { forwardRef } from 'react';
import uuid from 'react-native-uuid';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  DEFAULT_FORM_SHORT_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
  FormShortAddressInput,
  FormShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import {
  DEFAULT_FORM_NAME,
  FormNameInput,
  FormNameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizPageHandle } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import {
  siblingDobAtom,
  siblingIdsAtom,
  siblingLivesInUsaAtom,
  siblingNameAtom,
  siblingSexAtom,
} from '@/lib/data/sibling';
import { nameAtom } from '@/lib/data/user';
import { SexEnum } from '@/lib/schemas';
import { TranslationContextProvider } from '@/lib/translation';
import { required, stretchTo } from '@/lib/utils';

type SiblingQuizPageProps = {
  id: string;
  index: number;
};

export default function SiblingsDetails() {
  const [siblingIds, setSiblingIds] = useAtom(siblingIdsAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasSiblings: null,
        }}
        onSubmit={({ numSiblings }) => {
          setSiblingIds(
            stretchTo(siblingIds, numSiblings ?? 0, () => uuid.v4())
          );

          return true;
        }}
        pageId='sibling-information'
        schema={z.object({
          hasSiblings: required(z.boolean().nullable()),
          numSiblings: z
            .string()
            // .regex(/^\d+$/)
            .pipe(z.coerce.number<string>().int().positive())
            .optional(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasSiblings'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('hasSiblings')}
              activeValue={'0'}
              control={control}
              name='numSiblings'
            >
              <FormBlock animated>
                <QuizFieldTitle />
                <QuizTextInput inputMode='numeric' />
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>

      {siblingIds.map((id, index) => (
        <SiblingQuizPage id={id} index={index} key={id} />
      ))}
    </QuizScreen>
  );
}

const SiblingQuizPage = forwardRef<QuizPageHandle, SiblingQuizPageProps>(
  function SiblingQuizPage({ id, index }, ref) {
    const numberOfSiblings = useAtomValue(siblingIdsAtom).length;
    const setDob = useSetAtom(siblingDobAtom(id));
    const setLivesInUsa = useSetAtom(siblingLivesInUsaAtom(id));
    const setSex = useSetAtom(siblingSexAtom(id));
    const setName = useSetAtom(siblingNameAtom(id));
    const lastName = useAtomValue(nameAtom).last;

    return (
      <QuizPage
        defaultValues={{
          birthLocation: DEFAULT_FORM_SHORT_ADDRESS,
          dob: null,
          livesInUsa: null,
          name: {
            ...DEFAULT_FORM_NAME,
            last: lastName,
          },
          sex: null,
        }}
        onSubmit={({ dob, livesInUsa, name, sex }) => {
          setDob(dob);
          setLivesInUsa(livesInUsa);
          setName(name);
          setSex(sex);

          return true;
        }}
        pageId='sibling'
        pageKey={id}
        ref={ref}
        schema={z.object({
          birthLocation: required(FormShortAddressSchema),
          currentLocation: FormAddressSchema.optional(),
          dob: required(z.date().nullable()),
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
                total: numberOfSiblings,
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
              <QuizFieldTitle name='birth-location' variant='titleLarge' />
              <FormShortAddressInput lens={lens.focus('birthLocation')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='livesInUsa'>
                <QuizFieldTitle variant='titleLarge' />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('livesInUsa')}
              activeValue={DEFAULT_FORM_ADDRESS}
              control={control}
              name='currentLocation'
            >
              <FormBlock animated>
                <QuizFieldTitle variant='titleLarge' />
                <FormAddressInput lens={lens.focus('currentLocation')} />
              </FormBlock>
            </ConditionalFormWrapper>
          </TranslationContextProvider>
        )}
      </QuizPage>
    );
  }
);
