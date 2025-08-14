import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { ConditionalFormBlock, FormField } from '@/components/ui/form/field';
import { FormBooleanInput, FormRadioGroup } from '@/components/ui/form/radio';
import { QuizRadioItem } from '@/components/ui/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
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

              <ConditionalFormBlock
                active={!!watch('hasChildren')}
                activeValue={'0'}
                control={control}
                name='numberOfChildren'
              >
                <QuizFieldTitle />
                <QuizTextInput inputMode='numeric' />
              </ConditionalFormBlock>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
