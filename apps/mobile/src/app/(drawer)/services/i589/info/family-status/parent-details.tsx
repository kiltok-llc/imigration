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
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

export default function ParentDetails() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          alive: null,
          birthLocation: DEFAULT_SHORT_ADDRESS,
          name: DEFAULT_NAME,
        }}
        onSubmit={() => true}
        pageId='father'
        schema={z.object({
          alive: required(z.boolean().nullable()),
          birthLocation: ShortAddressSchema,
          currentLocation: AddressWithCountrySchema.optional(),
          name: NameSchema,
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='name' variant='titleLarge' />
              <FormNameInput lens={lens.focus('name')} />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='birth-location' variant='titleLarge' />
              <FormShortAddressInput lens={lens.focus('birthLocation')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='alive'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('alive')}
              activeValue={DEFAULT_ADDRESS_WITH_COUNTRY}
              control={control}
              name='currentLocation'
            >
              <QuizFieldTitle variant='titleLarge' />
              <FormAddressWithCountryInput
                lens={lens.focus('currentLocation')}
              />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          alive: null,
          birthLocation: DEFAULT_SHORT_ADDRESS,
          name: DEFAULT_NAME,
        }}
        onSubmit={() => true}
        pageId='mother'
        schema={z.object({
          alive: required(z.boolean().nullable()),
          birthLocation: ShortAddressSchema,
          currentLocation: AddressWithCountrySchema.optional(),
          name: NameSchema,
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='name' variant='titleLarge' />
              <FormNameInput lens={lens.focus('name')} />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='birth-location' variant='titleLarge' />
              <FormShortAddressInput lens={lens.focus('birthLocation')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='alive'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('alive')}
              activeValue={DEFAULT_ADDRESS_WITH_COUNTRY}
              control={control}
              name='currentLocation'
            >
              <QuizFieldTitle variant='titleLarge' />
              <FormAddressWithCountryInput
                lens={lens.focus('currentLocation')}
              />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
