import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  EXAMPLE_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormArray, FormArrayItems } from '@/components/form/fieldarray';
import {
  DEFAULT_FORM_RANGE,
  EXAMPLE_RANGE,
  FormRangeInput,
  FormRangeSchema,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizFormPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';

export default function PreviousAddresses() {
  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          address: DEFAULT_FORM_ADDRESS,
          range: DEFAULT_FORM_RANGE,
        }}
        onSubmit={() => true}
        pageId='previous-residence'
        sampleData={{
          example: {
            address: EXAMPLE_ADDRESS,
            range: EXAMPLE_RANGE,
          },
        }}
        schema={z.object({
          address: FormAddressSchema,
          range: FormRangeSchema,
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
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          residences: [],
        }}
        onSubmit={() => true}
        pageId='past-residences'
        sampleData={{
          example: {
            residences: [
              {
                address: EXAMPLE_ADDRESS,
                range: EXAMPLE_RANGE,
              },
              {
                address: EXAMPLE_ADDRESS,
                range: EXAMPLE_RANGE,
              },
            ],
          },
        }}
        schema={z.object({
          residences: z.array(
            z.object({
              address: FormAddressSchema,
              range: FormRangeSchema,
            })
          ),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormArray control={control} name='residences'>
              <FormArrayItems>
                {(idx) => (
                  <FormBlock>
                    <QuizFieldArrayItemHeader />
                    <FormAddressInput
                      lens={lens.focus(`residences.${idx}.address`)}
                    />
                    <FormRangeInput
                      lens={lens.focus(`residences.${idx}.range`)}
                    />
                  </FormBlock>
                )}
              </FormArrayItems>
              <QuizFieldArrayAdd
                value={{
                  address: DEFAULT_FORM_ADDRESS,
                  range: DEFAULT_FORM_RANGE,
                }}
              />
            </FormArray>
          </>
        )}
      </QuizFormPage>
    </QuizScreen>
  );
}
