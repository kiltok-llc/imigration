import { useAtomValue } from 'jotai';
import z from 'zod/v4';

import { TranslationContextProvider } from '@/components/trans';
import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/ui/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/ui/form/radio';
import { QuizDateInput } from '@/components/ui/quiz/date';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import {
  QuizFieldTitle,
  QuizPageTitle,
  QuizTitle,
} from '@/components/ui/quiz/title';
import { userDataFamily } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

export default function ChildrenDetails() {
  const numberOfChildren = useAtomValue(userDataFamily('numberOfChildren'))!;

  return (
    <QuizScreen>
      {Array.from({ length: numberOfChildren }).map((_, i) => (
        <QuizPage
          defaultValues={{
            dob: null,
            ethnicity: '',
            livesInUsa: null,
            name: DEFAULT_NAME,
            sex: null,
          }}
          key={i}
          onSubmit={() => true}
          pageId='child'
          schema={z.object({
            dob: required(z.date().nullable()),
            ethnicity: z.string(),
            livesInUsa: required(z.boolean().nullable()),
            name: NameSchema,
            sex: required(SexEnum.nullable()),
          })}
        >
          {({ control, lens, watch }) => (
            <TranslationContextProvider
              value={{
                context: watch('name.first') ? 'named' : 'unnamed',
                current: i + 1,
                name: watch('name.first'),
                total: numberOfChildren,
              }}
            >
              <QuizPageTitle />

              <FormBlock>
                <QuizTitle name='name' variant='titleLarge' />
                <FormNameInput lens={lens.focus('name')} />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='sex'>
                  <QuizFieldTitle variant='titleLarge' />
                  <FormSexInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='dob'>
                  <QuizFieldTitle variant='titleLarge' />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='livesInUsa'>
                  <QuizFieldTitle variant='titleLarge' />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='ethnicity'>
                  <QuizFieldTitle variant='titleLarge' />
                  <QuizTextInput optional />
                </FormField>
              </FormBlock>
            </TranslationContextProvider>
          )}
        </QuizPage>
      ))}
    </QuizScreen>
  );
}
