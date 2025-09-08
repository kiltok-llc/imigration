import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import {
  DEFAULT_FORM_NAME,
  FormNameInput,
  FormNameSchema,
} from '@/components/form/name';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizCommaListInput, QuizTextInput } from '@/components/quiz/text';
import {
  aliasesAtom,
  maidenNameAtom,
  nameAtom,
  otherNamesAtom,
} from '@/lib/data/user';
import { required, stringList } from '@/lib/utils';

export default function NameAndAliases() {
  const setName = useSetAtom(nameAtom);
  const setMaidenName = useSetAtom(maidenNameAtom);
  const setOtherNames = useSetAtom(otherNamesAtom);
  const setAliases = useSetAtom(aliasesAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={DEFAULT_FORM_NAME}
        onSuccess={(name) => {
          setName(name);
        }}
        pageId='basic-names'
        schema={FormNameSchema}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormNameInput lens={lens} />
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          maidenName: '',
          otherNames: '',
        }}
        onSuccess={({ maidenName, otherNames }) => {
          setMaidenName(maidenName);
          setOtherNames(otherNames);
        }}
        pageId='additional-names'
        schema={z.object({
          maidenName: z.string(),
          otherNames: stringList(z.array(z.string().nonempty())),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='maidenName'>
                <QuizTextInput hint='optional' />
              </FormField>

              <FormField control={control} name='otherNames'>
                <QuizCommaListInput hint='optional' />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasAlias: null,
        }}
        onSuccess={({ aliases }) => {
          setAliases(aliases ?? []);
        }}
        pageId='alias-information'
        schema={z.object({
          aliases: stringList(
            z.array(z.string().nonempty()).nonempty()
          ).optional(),
          hasAlias: required(z.boolean().nullable()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasAlias'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>

              <ConditionalFormWrapper
                active={!!watch('hasAlias')}
                activeValue=''
                control={control}
                name='aliases'
              >
                <FormBlock animated>
                  <QuizCommaListInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
