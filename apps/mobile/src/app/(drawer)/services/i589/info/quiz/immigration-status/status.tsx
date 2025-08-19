import { isEqual } from '@ver0/deep-equal';
import { useLocalSearchParams } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import { QuizFieldDescription, QuizFieldTitle } from '@/components/quiz/label';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { userDataAtom } from '@/lib/data/user';
import { CourtStatusEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

const firstNameFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? optic
            .prop('children')
            .optional()
            .at(index)
            .prop('name')
            .optional()
            .prop('first')
        : optic.prop(context).optional().prop('name').optional().prop('first')
    ),
  isEqual
);

const passportFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? optic.prop('children').optional().at(index).prop('passport')
        : optic.prop(context).optional().prop('passport')
    ),
  isEqual
);

type Context = 'child' | 'client' | 'spouse';
type Param = {
  context: Context;
  index: number;
};

const useParam = () => {
  const { context, index } = useLocalSearchParams<{
    context: Context;
    index: string;
  }>();
  return {
    context,
    index: Number(index),
  };
};

export default function Status() {
  const param = useParam();
  const setPassport = useSetAtom(passportFamily(param));
  console.log('userdata', useAtomValue(userDataAtom));
  const name = useAtomValue(firstNameFamily(param));

  return (
    <TranslationContextProvider
      value={{
        values: { name },
      }}
    >
      <QuizScreen>
        <QuizPage
          defaultValues={{
            hasPassport: null,
          }}
          onSubmit={({ country, hasPassport, number }) => {
            if (hasPassport) {
              setPassport({
                country: country!,
                number: number!,
              });
            } else {
              setPassport(undefined);
            }

            return true;
          }}
          pageId='passport'
          schema={z.object({
            country: z.string().nonempty().optional(),
            hasPassport: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasPassport'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasPassport')}
                activeValue=''
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasPassport')}
                activeValue=''
                control={control}
                name='country'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{ hasAlienNumber: null }}
          onSubmit={() => true}
          pageId='alien-number'
          schema={z.object({
            hasAlienNumber: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasAlienNumber'>
                  <QuizFieldTitle />
                  <QuizFieldDescription />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasAlienNumber')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasSsn: null,
          }}
          onSubmit={() => true}
          pageId='ssn'
          schema={z.object({
            hasSsn: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasSsn'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasSsn')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasUscis: null,
          }}
          onSubmit={() => true}
          pageId='uscis'
          schema={z.object({
            hasUscis: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasUscis'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasUscis')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            courtStatus: null,
          }}
          onSubmit={() => true}
          pageId='court'
          schema={z.object({
            courtStatus: required(CourtStatusEnum.nullable()),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='courtStatus'>
                  <QuizFieldTitle />
                  <FormRadioGroup>
                    {CourtStatusEnum.options.map((status) => (
                      <QuizRadioItem key={status} value={status} />
                    ))}
                  </FormRadioGroup>
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>
      </QuizScreen>
    </TranslationContextProvider>
  );
}
