import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { userDataFamily } from '@/lib/data/user';
import { MaritalStatusEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function MaritalAndChildren() {
  const setMaritalStatus = useSetAtom(userDataFamily('maritalStatus'));
  const setNumberOfChildren = useSetAtom(userDataFamily('numberOfChildren'));

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          maritalStatus: null,
        }}
        onSubmit={({ maritalStatus }) => {
          setMaritalStatus(maritalStatus);

          return true;
        }}
        pageId='marital-status'
        schema={z.object({
          maritalStatus: required(MaritalStatusEnum.nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='maritalStatus'>
                <QuizFieldTitle />
                <FormRadioGroup>
                  {MaritalStatusEnum.options.map((status) => (
                    <QuizRadioItem key={status} value={status} />
                  ))}
                </FormRadioGroup>
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasChildren: null,
        }}
        onSubmit={({ numberOfChildren }) => {
          setNumberOfChildren(numberOfChildren ?? 0);

          return true;
        }}
        pageId='children-information'
        schema={z.object({
          hasChildren: required(z.boolean().nullable()),
          numberOfChildren: z
            .string()
            // .regex(/^\d+$/)
            .pipe(z.coerce.number<string>().int().positive())
            .optional(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasChildren'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasChildren')}
              activeValue={'0'}
              control={control}
              name='numberOfChildren'
            >
              <QuizFieldTitle />
              <QuizTextInput inputMode='numeric' />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
