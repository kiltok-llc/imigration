import { useSetAtom } from 'jotai';
import { Ref } from 'react';
import {
  MaskedTextInput,
  MaskedTextInputRef,
} from 'react-native-advanced-input-mask';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizForm } from '@/components/quiz/form';
import { QuizPageDescription, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { emailAtom, phoneNumberAtom } from '@/lib/data/user';

export default function ContactInformation() {
  const setPhoneNumber = useSetAtom(phoneNumberAtom);
  const setEmail = useSetAtom(emailAtom);

  return (
    <QuizScreen>
      <QuizPage pageId='contact-information'>
        <QuizForm
          defaultValues={{ email: '', phoneNumber: '+1 ' }}
          onSuccess={({ email, phoneNumber }) => {
            setPhoneNumber(phoneNumber);
            setEmail(email);
          }}
          sampleData={{
            example: {
              email: 'test@example.com',
              phoneNumber: '+1 (555) 555-5555',
            },
          }}
          schema={z.object({
            email: z.email(),
            phoneNumber: z.string().regex(/^\+1 \(\d{3}\) \d{3}-\d{4}$/),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <QuizPageTitle />
                <QuizPageDescription />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='phoneNumber'>
                  <QuizTextInput
                    inputMode='tel'
                    render={({ ref, ...props }) => (
                      <MaskedTextInput
                        autocomplete={false}
                        mask='+1 ([000]) [000]-[0000]'
                        ref={ref as Ref<MaskedTextInputRef>}
                        {...props}
                      />
                    )}
                  />
                </FormField>

                <FormField control={control} name='email'>
                  <QuizTextInput inputMode='email' />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>
    </QuizScreen>
  );
}
