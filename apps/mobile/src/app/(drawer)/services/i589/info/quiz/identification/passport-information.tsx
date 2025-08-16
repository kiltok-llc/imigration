import { atom, useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
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
