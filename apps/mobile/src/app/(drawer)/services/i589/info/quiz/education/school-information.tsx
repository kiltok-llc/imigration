import z from 'zod/v4';

import {
  AddressSchema,
  DEFAULT_ADDRESS,
  FormAddressInput,
} from '@/components/ui/form/address';
import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormRadioGroup } from '@/components/ui/form/radio';
import {
  DEFAULT_RANGE,
  FormRangeInput,
  RangeSchemaWithOptionalEnd,
} from '@/components/ui/form/range';
import { QuizRadioItem } from '@/components/ui/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle, QuizPageTitle } from '@/components/ui/quiz/title';
import { SchoolLevelEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function SchoolInformation() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          schoolLevel: null,
          schoolName: '',
        }}
        onSubmit={() => true}
        pageId='basic-school-info'
        schema={z.object({
          schoolLevel: required(SchoolLevelEnum.nullable()),
          schoolName: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='schoolName'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>

              <FormField control={control} name='schoolLevel'>
                <QuizFieldTitle />
                <FormRadioGroup>
                  {SchoolLevelEnum.options.map((level) => (
                    <QuizRadioItem key={level} value={level} />
                  ))}
                </FormRadioGroup>
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={DEFAULT_ADDRESS}
        onSubmit={() => true}
        pageId='school-location'
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
        pageId='attendance-period'
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
