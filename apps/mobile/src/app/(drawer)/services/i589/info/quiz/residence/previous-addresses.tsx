import z from 'zod/v4';

import {
  AddressSchema,
  DEFAULT_ADDRESS,
  FormAddressInput,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import {
  FormFieldArray,
  FormFieldArrayItemBlocks,
} from '@/components/form/fieldarray';
import { FormRangeInput, RangeSchema } from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';

export default function PreviousAddresses() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          address: DEFAULT_ADDRESS,
          range: {
            end: null,
            start: null,
          },
        }}
        onSubmit={() => true}
        pageId='previous-residence'
        schema={z.object({
          address: AddressSchema,
          range: RangeSchema,
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <FormField control={control} name='address'>
                <QuizFieldTitle />
                <FormAddressInput lens={lens.focus('address')} />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='range'>
                <QuizFieldTitle />
                <FormRangeInput lens={lens.focus('range')} />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          residences: [],
        }}
        onSubmit={() => true}
        pageId='past-residences'
        schema={z.object({
          residences: z.array(
            z.object({
              address: AddressSchema,
              range: RangeSchema,
            })
          ),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormFieldArray control={control} name='residences'>
              <FormFieldArrayItemBlocks>
                {(idx) => (
                  <>
                    <FormBlock>
                      <QuizFieldArrayItemHeader />
                      <FormAddressInput
                        lens={lens.focus(`residences.${idx}.address`)}
                      />
                      <FormRangeInput
                        lens={lens.focus(`residences.${idx}.range`)}
                      />
                    </FormBlock>
                  </>
                )}
              </FormFieldArrayItemBlocks>
              <QuizFieldArrayAdd
                value={{
                  address: DEFAULT_ADDRESS,
                  range: {
                    end: null,
                    start: null,
                  },
                }}
              />
            </FormFieldArray>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
