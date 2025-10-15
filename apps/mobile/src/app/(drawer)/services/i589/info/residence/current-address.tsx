import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  EXAMPLE_ADDRESS,
  FormAddressInput,
  FormAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizForm } from '@/components/quiz/form';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { useLocalSegments } from '@/hooks/use-local-segments';
import { addressesAtom, mailingAddressAtom } from '@/lib/data/user';
import { required } from '@/lib/utils';

export default function CurrentAddress() {
  const [_services, service = ''] = useLocalSegments();
  const router = useRouter();
  const setAddresses = useSetAtom(addressesAtom);
  const setMailingAddress = useSetAtom(mailingAddressAtom);

  return (
    <QuizScreen>
      <QuizPage pageId='us-residence-status'>
        <QuizForm
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
          sampleData={{
            example: {
              resident: true,
            },
          }}
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
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='address'>
        <QuizForm
          defaultValues={{ address: DEFAULT_FORM_ADDRESS, date: null }}
          onSuccess={({ address, date }) =>
            setAddresses(([_first, ...rest]) => [
              {
                country: 'USA',
                end: null,
                start: date,
                ...address,
              },
              ...rest,
            ])
          }
          sampleData={{
            example: {
              address: EXAMPLE_ADDRESS,
              date: new Date(),
            },
          }}
          schema={z.object({
            address: FormAddressSchema,
            date: required(z.date().nullable()),
          })}
        >
          {({ control, lens }) => (
            <>
              <FormBlock>
                <QuizPageTitle />
              </FormBlock>

              <FormBlock>
                <FormAddressInput lens={lens.focus('address')} />
                <FormField control={control} name='date'>
                  <QuizDateInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='mailing-address'>
        <QuizForm
          defaultValues={{
            receivesMail: null,
          }}
          onSuccess={({ mailingAddress }) =>
            setMailingAddress(
              mailingAddress ? { ...mailingAddress, country: 'USA' } : null
            )
          }
          sampleData={{
            example: {
              receivesMail: true,
            },
          }}
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
        </QuizForm>
      </QuizPage>
    </QuizScreen>
  );
}
