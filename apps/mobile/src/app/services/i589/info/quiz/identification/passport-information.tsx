import { atom, useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import { FormField } from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizDateInput } from '@/components/ui/quiz/date';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { userDataFamily } from '@/lib/data/user';
import { required } from '@/lib/utils';

const passportAtom = userDataFamily('passport');
const hasPassportAtom = atom(
  (get) => get(passportAtom) != null,
  (_get, set, hasPassport: boolean) => {
    if (hasPassport) {
      set(passportAtom, {});
    } else {
      set(passportAtom, null);
    }
  }
);

export default function PassportInformation() {
  const [hasPassport, setHasPassport] = useAtom(hasPassportAtom);
  const setPassportNumber = useSetAtom(userDataFamily('passport.number'));
  const setPassportCountry = useSetAtom(userDataFamily('passport.country'));

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasPassport: null,
        }}
        onSubmit={({ hasPassport }) => {
          setHasPassport(hasPassport);

          return true;
        }}
        pageId='has-passport'
        schema={z.object({
          hasPassport: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasPassport'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      {hasPassport && (
        <QuizPage
          defaultValues={{
            country: '',
            number: '',
          }}
          onSubmit={({ country, number }) => {
            setPassportNumber(number);
            setPassportCountry(country);

            return true;
          }}
          pageId='passport-details'
          schema={z.object({
            country: z.string().nonempty(),
            number: z.string().nonempty(),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='number'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='country'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>
      )}

      {hasPassport && (
        <QuizPage
          defaultValues={{
            expiration: null,
            issue: null,
          }}
          onSubmit={() => true}
          pageId='passport-dates'
          schema={z.object({
            expiration: required(z.date().nullable()),
            issue: required(z.date().nullable()),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='issue'>
                  <QuizFieldTitle />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='expiration'>
                  <QuizFieldTitle />
                  <QuizDateInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>
      )}
    </QuizScreen>
  );
}
