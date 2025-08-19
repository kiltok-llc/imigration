import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import { forwardRef } from 'react';
import z from 'zod/v4';

import {
  AddressSchema,
  DEFAULT_ADDRESS,
  DEFAULT_SHORT_ADDRESS,
  FormAddressInput,
  FormShortAddressInput,
  ShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
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
import { numberOfSiblingsAtom, userDataAtom } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

export default function SiblingsDetails() {
  const [numberOfSiblings, setNumberOfSiblings] = useAtom(numberOfSiblingsAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasSiblings: null,
        }}
        onSubmit={({ number }) => {
          setNumberOfSiblings(number ?? 0);

          return true;
        }}
        pageId='sibling-information'
        schema={z.object({
          hasSiblings: required(z.boolean().nullable()),
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
              <FormField control={control} name='hasSiblings'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasSiblings')}
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

      {Array.from({ length: numberOfSiblings ?? 0 }).map((_, i) => (
        <SiblingQuizPage index={i} key={i} />
      ))}
    </QuizScreen>
  );
}

const siblingFamily = atomFamily((index: number) =>
  focusAtom(userDataAtom, (optic) =>
    optic.prop('siblings').optional().at(index)
  )
);

type SiblingQuizPageProps = {
  index: number;
};

const SiblingQuizPage = forwardRef<QuizPageHandle, SiblingQuizPageProps>(
  function SiblingQuizPage({ index }: SiblingQuizPageProps, ref) {
    const numberOfSiblings = useAtomValue(numberOfSiblingsAtom);
    const setSibling = useSetAtom(siblingFamily(index));

    return (
      <QuizPage
        defaultValues={{
          birthLocation: DEFAULT_SHORT_ADDRESS,
          dob: null,
          livesInUsa: null,
          name: DEFAULT_NAME,
          sex: null,
        }}
        key={index}
        onSubmit={({ name, sex }) => {
          setSibling({ name, sex });

          return true;
        }}
        pageId='sibling'
        pageKey={index}
        ref={ref}
        schema={z.object({
          birthLocation: required(ShortAddressSchema),
          currentLocation: AddressSchema.optional(),
          dob: required(z.date().nullable()),
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

            <ConditionalFormFieldBlock
              active={!!watch('livesInUsa')}
              activeValue={DEFAULT_ADDRESS}
              control={control}
              name='currentLocation'
            >
              <QuizFieldTitle variant='titleLarge' />
              <FormAddressInput lens={lens.focus('currentLocation')} />
            </ConditionalFormFieldBlock>
          </TranslationContextProvider>
        )}
      </QuizPage>
    );
  }
);
