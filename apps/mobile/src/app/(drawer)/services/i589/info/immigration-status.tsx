import { isEqual } from '@ver0/deep-equal';
import { useLocalSearchParams } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import { OpticFor_ } from 'optics-ts';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import { QuizFieldDescription, QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { UserData, userDataAtom } from '@/lib/data/user';
import { ImmigrationCourtStatusEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

const child = (optic: OpticFor_<UserData>, index: number) =>
  optic.prop('children').optional().at(index);

const ctx = (optic: OpticFor_<UserData>, context: 'client' | 'spouse') =>
  optic.prop(context).optional();

const firstNameFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('name').optional().prop('first')
        : ctx(optic, context).prop('name').optional().prop('first')
    ),
  isEqual
);

const passportFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('passport')
        : ctx(optic, context).prop('passport')
    ),
  isEqual
);

const alienNumberFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('alienNumber')
        : ctx(optic, context).prop('alienNumber')
    ),
  isEqual
);

const ssnFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('ssn')
        : ctx(optic, context).prop('ssn')
    ),
  isEqual
);

const uscisNumberFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('uscisNumber')
        : ctx(optic, context).prop('uscisNumber')
    ),
  isEqual
);

const immigrationCourtStatusFamily = atomFamily(
  ({ context, index }: Param) =>
    focusAtom(userDataAtom, (optic) =>
      context === 'child'
        ? child(optic, index).prop('immigrationCourtStatus')
        : ctx(optic, context).prop('immigrationCourtStatus')
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

export default function ImmigrationStatus() {
  const param = useParam();
  const setPassport = useSetAtom(passportFamily(param));
  const setAlienNumber = useSetAtom(alienNumberFamily(param));
  const setSsn = useSetAtom(ssnFamily(param));
  const setUscisNumber = useSetAtom(uscisNumberFamily(param));
  const setImmigrationCourtStatus = useSetAtom(
    immigrationCourtStatusFamily(param)
  );
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
          onSubmit={({ number }) => {
            setAlienNumber(number);
            return true;
          }}
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
          onSubmit={({ number }) => {
            setSsn(number);
            return true;
          }}
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
          onSubmit={({ number }) => {
            setUscisNumber(number);
            return true;
          }}
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
            status: null,
          }}
          onSubmit={({ status }) => {
            setImmigrationCourtStatus(status);
            return true;
          }}
          pageId='court'
          schema={z.object({
            status: required(ImmigrationCourtStatusEnum.nullable()),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='status'>
                  <QuizFieldTitle />
                  <FormRadioGroup>
                    {ImmigrationCourtStatusEnum.options.map((status) => (
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
