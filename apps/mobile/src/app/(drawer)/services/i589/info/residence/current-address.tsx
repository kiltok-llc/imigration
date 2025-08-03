import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { useService } from '@/hooks/use-service';
import { addressAtom, mailingAddressAtom } from '@/lib/data/user';
import { required } from '@/lib/utils';

export default function CurrentAddress() {
  const service = useService();
  const router = useRouter();
  const setAddress = useSetAtom(addressAtom);
  const setMailingAddress = useSetAtom(mailingAddressAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          resident: null,
        }}
        onSubmit={({ resident }) => {
          if (!resident) {
            router.navigate(`/services/${service}/ineligible`);
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
        onSuccess={(address) =>
          setAddress({
            country: 'USA',
            ...address,
          })
        }
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
        onSuccess={({ mailingAddress }) =>
          setMailingAddress(
            mailingAddress ? { ...mailingAddress, country: 'USA' } : null
          )
        }
        pageId='mailing-address'
        schema={z.object({
          mailingAddress: FormAddressSchema.optional(),
          receivesMail: required(z.boolean().nullable()),
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='receivesMail'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={watch('receivesMail') === false}
              activeValue={DEFAULT_FORM_ADDRESS}
              control={control}
              name={'mailingAddress'}
            >
              <FormBlock animated>
                <QuizFieldTitle />
                <FormAddressInput
                  lens={lens
                    .focus('mailingAddress')
                    .narrow<z.input<typeof FormAddressSchema>>()}
                />
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
