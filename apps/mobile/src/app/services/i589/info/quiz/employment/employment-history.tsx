import z from 'zod/v4';

import {
  AddressSchema,
  DEFAULT_ADDRESS,
  FormAddressInput,
} from '@/components/ui/form/address';
import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import {
  DEFAULT_RANGE,
  FormRangeInput,
  RangeSchemaWithOptionalEnd,
} from '@/components/ui/form/range';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle, QuizPageTitle } from '@/components/ui/quiz/title';

export default function EmploymentHistory() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          employerName: '',
          occupation: '',
        }}
        onSubmit={() => true}
        pageId='basic-employment-info'
        schema={z.object({
          employerName: z.string().nonempty(),
          occupation: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='employerName'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>

              <FormField control={control} name='occupation'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={DEFAULT_ADDRESS}
        onSubmit={() => true}
        pageId='employer-location'
        schema={AddressSchema}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormAddressInput lens={lens} />
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={DEFAULT_RANGE}
        onSubmit={() => true}
        pageId='employment-period'
        schema={RangeSchemaWithOptionalEnd}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormRangeInput lens={lens} optionalEnd />
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
