import { useRouter } from 'expo-router';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { required } from '@/lib/utils';

export default function CurrentAddress() {
  const router = useRouter();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          resident: null,
        }}
        onSubmit={({ resident }) => {
          if (!resident) {
            router.navigate('/services/i589/ineligible');
            return false;
          }

          return true;
        }}
        pageId='us-residence-status'
        schema={z.object({
          resident: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='resident'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={DEFAULT_FORM_ADDRESS}
        onSubmit={() => true}
        pageId='address'
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
        defaultValues={{
          receivesMail: null,
        }}
        onSubmit={() => true}
        pageId='mailing-address'
        schema={z.object({
          mailingAddress: FormAddressSchema.optional(),
          receivesMail: required(z.boolean().nullable()),
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormField control={control} name='receivesMail'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>

            <ConditionalFormFieldBlock
              active={watch('receivesMail') === false}
              activeValue={DEFAULT_FORM_ADDRESS}
              control={control}
              name={'mailingAddress'}
            >
              <QuizFieldTitle />
              <FormAddressInput lens={lens.focus('mailingAddress')} />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
