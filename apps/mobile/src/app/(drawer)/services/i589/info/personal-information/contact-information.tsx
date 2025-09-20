import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { emailAtom, phoneNumberAtom } from '@/lib/data/user';

export default function ContactInformation() {
  const setPhoneNumber = useSetAtom(phoneNumberAtom);
  const setEmail = useSetAtom(emailAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{ email: '', phoneNumber: '' }}
        onSuccess={({ email, phoneNumber }) => {
          setPhoneNumber(phoneNumber);
          setEmail(email);
        }}
        pageId='contact-information'
        schema={z.object({
          email: z.string().email().or(z.literal('')), // Allow empty for optional
          phoneNumber: z.string(),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='phoneNumber'>
                <QuizTextInput hint='optional' inputMode='tel' />
              </FormField>

              <FormField control={control} name='email'>
                <QuizTextInput hint='optional' inputMode='email' />
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
