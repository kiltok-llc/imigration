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
import { FormRadioGroup } from '@/components/form/radio';
import {
  DEFAULT_FORM_RANGE,
  FormRangeInput,
  FormRangeSchemaWithOptionalEnd,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { DEFAULT_SCHOOL_INFO } from '@/lib/data/schema';
import { schoolInfoAtom } from '@/lib/data/user';
import { SchoolLevelEnum } from '@/lib/schemas';
import { required } from '@/lib/utils';

export default function SchoolInformation() {
  const setSchoolInfo = useSetAtom(schoolInfoAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          level: null,
          name: '',
        }}
        onSuccess={({ level, name }) =>
          setSchoolInfo(([first, ...rest]) => [
            {
              ...(first ?? DEFAULT_SCHOOL_INFO),
              level,
              name,
            },
            ...rest,
          ])
        }
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
        defaultValues={DEFAULT_FORM_ADDRESS}
        onSuccess={(address) =>
          setSchoolInfo(([first, ...rest]) => [
            {
              ...(first ?? DEFAULT_SCHOOL_INFO),
              address: {
                ...address,
                country: 'USA',
              },
            },
            ...rest,
          ])
        }
        pageId='school-location'
        schema={FormAddressSchema}
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
        defaultValues={DEFAULT_FORM_RANGE}
        onSuccess={(range) =>
          setSchoolInfo(([first, ...rest]) => [
            {
              ...(first ?? DEFAULT_SCHOOL_INFO),
              range,
            },
            ...rest,
          ])
        }
        pageId='attendance-period'
        schema={FormRangeSchemaWithOptionalEnd}
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
        defaultValues={{ schools: [] }}
        onSuccess={({ schools }) =>
          setSchoolInfo(([first]) => [
            first!,
            ...schools.map(({ address, ...school }) => ({
              ...school,
              address: {
                ...address,
                country: 'USA',
              },
            })),
          ])
        }
        pageId='other-schools'
        schema={z.object({
          schools: z.array(FormSchoolSchema),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormArray control={control} name='schools'>
              <FormArrayItems>
                {(idx) => (
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
                )}
              </FormArrayItems>
              <QuizFieldArrayAdd value={DEFAULT_FORM_SCHOOL} />
            </FormArray>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}

const FormSchoolSchema = z.object({
  address: FormAddressSchema,
  level: required(SchoolLevelEnum.nullable()),
  name: z.string().nonempty(),
  range: FormRangeSchemaWithOptionalEnd,
});

const DEFAULT_FORM_SCHOOL: z.input<typeof FormSchoolSchema> = {
  address: DEFAULT_FORM_ADDRESS,
  level: null,
  name: '',
  range: DEFAULT_FORM_RANGE,
};
