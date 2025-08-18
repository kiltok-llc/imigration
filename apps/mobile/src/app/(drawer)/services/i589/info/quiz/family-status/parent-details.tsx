import { atom } from 'jotai';
import z from 'zod/v4';

import {
  AddressWithCountrySchema,
  DEFAULT_ADDRESS_WITH_COUNTRY,
  DEFAULT_SHORT_ADDRESS,
  FormAddressWithCountryInput,
  FormShortAddressInput,
  ShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import { DEFAULT_NAME, FormNameInput, NameSchema } from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { TranslationContextProvider } from '@/components/trans';
import { userDataFamily } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function ParentDetails() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          alive: null,
          birthLocation: DEFAULT_SHORT_ADDRESS,
          currentLocation: DEFAULT_ADDRESS_WITH_COUNTRY,
          name: DEFAULT_NAME,
        }}
        onSubmit={() => true}
        pageId="dad"
        schema={z.object({
          alive: required(z.boolean().nullable()),
          birthLocation: ShortAddressSchema,
          currentLocation: AddressWithCountrySchema,
          name: NameSchema,
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name="name" variant="titleLarge" />
              <FormNameInput lens={lens.focus('name')} />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name="birth-location" variant="titleLarge" />
              <FormShortAddressInput lens={lens.focus('birthLocation')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name="alive">
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('alive')}
              activeValue={DEFAULT_ADDRESS_WITH_COUNTRY}
              control={control}
              name="currentLocation"
            >
              <QuizFieldTitle variant="titleLarge" />
              <FormAddressWithCountryInput lens={lens.focus('currentLocation')} />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      {Array.from({ length: numberOfChildren ?? 0 }).map((_, i) => (
        <QuizPage
          defaultValues={{
            dob: null,
            ethnicity: '',
            hasBirthCertificate: null,
            livesInUsa: null,
            name: DEFAULT_NAME,
            sex: null,
          }}
          key={i}
          onSubmit={() => true}
          pageId="child"
          pageKey={i}
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
                count: i + 1,
                values: {
                  name: watch('name.first'),
                  ordinal: true,
                  total: numberOfChildren,
                },
              }}
            >
              <QuizPageTitle />

              <FormBlock>
                <QuizFieldTitle name="name" variant="titleLarge" />
                <FormNameInput lens={lens.focus('name')} />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="sex">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormSexInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="dob">
                  <QuizFieldTitle variant="titleLarge" />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="livesInUsa">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="ethnicity">
                  <QuizFieldTitle variant="titleLarge" />
                  <QuizTextInput optional />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="hasBirthCertificate">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasBirthCertificate')}
                activeValue={null}
                control={control}
                name="birthCertificate"
              >
                <QuizFieldTitle />
                <FormImageInput />
              </ConditionalFormFieldBlock>
            </TranslationContextProvider>
          )}
        </QuizPage>
      ))}
    </QuizScreen>
  );
}
