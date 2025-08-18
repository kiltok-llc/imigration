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
import { FormRadioGroup } from '@/components/form/radio';
import {
  DEFAULT_RANGE,
  FormRangeInput,
  RangeSchemaWithOptionalEnd,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { SchoolLevelEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function SchoolInformation() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          level: null,
          name: '',
        }}
        onSubmit={() => true}
        pageId='basic-school-info'
        schema={z.object({
          level: required(SchoolLevelEnum.nullable()),
          name: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='name'>
                <QuizFieldTitle />
                <QuizTextInput />
              </FormField>
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='level'>
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

      <QuizPage
        defaultValues={{
          schools: [],
        }}
        onSubmit={() => true}
        pageId='other-schools'
        schema={z.object({
          schools: z.array(
            z.object({
              address: AddressSchema,
              name: z.string().nonempty(),
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

            <FormFieldArray control={control} name='schools'>
              <FormFieldArrayItemBlocks>
                {(idx) => (
                  <>
                    <FormBlock>
                      <QuizFieldArrayItemHeader />
                      <FormField control={control} name={`schools.${idx}.name`}>
                        <QuizTextInput />
                      </FormField>
                      <FormAddressInput
                        lens={lens.focus(`schools.${idx}.address`)}
                      />
                      <FormRangeInput
                        lens={lens.focus(`schools.${idx}.range`)}
                        optionalEnd
                      />
                    </FormBlock>
                  </>
                )}
              </FormFieldArrayItemBlocks>
              <QuizFieldArrayAdd
                value={{
                  address: DEFAULT_ADDRESS,
                  name: '',
                  range: DEFAULT_RANGE
                }}
              />
            </FormFieldArray>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
