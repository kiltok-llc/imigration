import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormArray, FormArrayItems } from '@/components/form/fieldarray';
import {
  DEFAULT_FORM_RANGE,
  FormRangeInput,
  FormRangeSchemaWithOptionalEnd,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { jobHistorySchema } from '@/lib/data/user';

export default function EmploymentHistory() {
  const setJobHistory = useSetAtom(jobHistorySchema);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          jobs: [DEFAULT_FORM_JOB],
        }}
        onSuccess={({ jobs }) => {
          setJobHistory(
            jobs.map(({ address, ...job }) => ({
              address: {
                ...address,
                country: 'USA',
              },
              ...job,
            }))
          );
        }}
        pageId='jobs'
        schema={z.object({
          jobs: z.array(FormJobSchema),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormArray control={control} name='jobs'>
              <FormArrayItems>
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
              </FormArrayItems>
              <QuizFieldArrayAdd value={DEFAULT_FORM_JOB} />
            </FormArray>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}

const FormJobSchema = z.object({
  address: FormAddressSchema,
  employer: z.string().nonempty(),
  occupation: z.string().nonempty(),
  range: FormRangeSchemaWithOptionalEnd,
});

const DEFAULT_FORM_JOB: z.input<typeof FormJobSchema> = {
  address: DEFAULT_FORM_ADDRESS,
  employer: '',
  occupation: '',
  range: DEFAULT_FORM_RANGE,
};
