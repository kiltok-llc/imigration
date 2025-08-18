import { atom, useAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import { DEFAULT_NAME, FormNameInput, NameSchema } from '@/components/form/name';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { TranslationContextProvider } from '@/components/trans';
import { userDataFamily } from '@/lib/data/user';
import { SexEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';

const childrenAtom = userDataFamily('children');
const numberOfChildrenAtom = atom(
  (get) => get(childrenAtom)?.length ?? 0,
  (get, set, numberOfChildren: number) => {
    const children = get(childrenAtom) ?? [];
    if (numberOfChildren > children.length) {
      set(childrenAtom, [...children, ...Array.from({ length: numberOfChildren - children.length }, () => ({}))]);
    } else if (numberOfChildren < children.length) {
      set(childrenAtom, children.slice(0, numberOfChildren));
    }
  },
);

export default function ChildrenDetails() {
  const [numberOfChildren, setNumberOfChildren] = useAtom(numberOfChildrenAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasChildren: null,
        }}
        onSubmit={({ number }) => {
          setNumberOfChildren(number ?? 0);

          return true;
        }}
        pageId="children-information"
        schema={z.object({
          hasChildren: required(z.boolean().nullable()),
          number: z
            .string()
            // .regex(/^\d+$/)
            .pipe(z.coerce.number<string>().int().positive())
            .optional(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name="hasChildren">
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasChildren')}
              activeValue={'0'}
              control={control}
              name="number"
            >
              <QuizFieldTitle />
              <QuizTextInput inputMode="numeric" />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>

      {Array.from({ length: numberOfChildren ?? 0 }).map((_, i) => (
        <QuizPage
          defaultValues={{
            dob: null,
            ethnicity: '',
            hasBirthCertificate: null,
            livesInUsa: null,
            name: DEFAULT_NAME,
            sex: null,
          }}
          key={i}
          onSubmit={() => true}
          pageId="child"
          pageKey={i}
          schema={z.object({
            birthCertificate: required(z.string().nullable()).optional(),
            dob: required(z.date().nullable()),
            ethnicity: z.string(),
            hasBirthCertificate: required(z.boolean().nullable()),
            livesInUsa: required(z.boolean().nullable()),
            name: NameSchema,
            sex: required(SexEnum.nullable()),
          })}
        >
          {({ control, lens, watch }) => (
            <TranslationContextProvider
              value={{
                context: watch('name.first') ? 'named' : 'unnamed',
                count: i + 1,
                values: {
                  name: watch('name.first'),
                  ordinal: true,
                  total: numberOfChildren,
                },
              }}
            >
              <QuizPageTitle />

              <FormBlock>
                <QuizFieldTitle name="name" variant="titleLarge" />
                <FormNameInput lens={lens.focus('name')} />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="sex">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormSexInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="dob">
                  <QuizFieldTitle variant="titleLarge" />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="livesInUsa">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="ethnicity">
                  <QuizFieldTitle variant="titleLarge" />
                  <QuizTextInput optional />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name="hasBirthCertificate">
                  <QuizFieldTitle variant="titleLarge" />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasBirthCertificate')}
                activeValue={null}
                control={control}
                name="birthCertificate"
              >
                <QuizFieldTitle />
                <FormImageInput />
              </ConditionalFormFieldBlock>
            </TranslationContextProvider>
          )}
        </QuizPage>
      ))}
    </QuizScreen>
  );
}
