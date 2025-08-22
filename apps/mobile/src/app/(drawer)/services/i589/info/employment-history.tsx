import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import {
  FormFieldArray,
  FormFieldArrayItemBlocks,
} from '@/components/form/fieldarray';
import {
  DEFAULT_RANGE,
  FormRangeInput,
  RangeSchemaWithOptionalEnd,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';

export default function EmploymentHistory() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          jobs: [
            {
              address: DEFAULT_FORM_ADDRESS,
              employer: '',
              occupation: '',
              range: DEFAULT_RANGE,
            },
          ],
        }}
        onSubmit={() => true}
        pageId='jobs'
        schema={z.object({
          jobs: z.array(
            z.object({
              address: FormAddressSchema,
              employer: z.string().nonempty(),
              occupation: z.string().nonempty(),
              range: RangeSchemaWithOptionalEnd,
            })
          ),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormFieldArray control={control} name='jobs'>
              <FormFieldArrayItemBlocks>
                {(idx) => (
                  <FormBlock>
                    <QuizFieldArrayItemHeader />
                    <FormField control={control} name={`jobs.${idx}.employer`}>
                      <QuizTextInput />
                    </FormField>
                    <FormField
                      control={control}
                      name={`jobs.${idx}.occupation`}
                    >
                      <QuizTextInput />
                    </FormField>
                    <FormAddressInput
                      lens={lens.focus(`jobs.${idx}.address`)}
                    />
                    <FormRangeInput
                      lens={lens.focus(`jobs.${idx}.range`)}
                      optionalEnd
                    />
                  </FormBlock>
                )}
              </FormFieldArrayItemBlocks>
              <QuizFieldArrayAdd
                value={{
                  address: DEFAULT_FORM_ADDRESS,
                  name: '',
                  range: DEFAULT_RANGE,
                }}
              />
            </FormFieldArray>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
