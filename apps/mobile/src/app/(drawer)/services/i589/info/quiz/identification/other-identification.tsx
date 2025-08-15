import { atom, useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import { FormBlock } from '@/components/ui/form/block';
import {
  ConditionalFormFieldBlock,
  FormField,
} from '@/components/ui/form/field';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizTextInput } from '@/components/ui/quiz/text';
import { QuizFieldTitle } from '@/components/ui/quiz/title';
import { userDataFamily } from '@/lib/data/user';
import { required } from '@/lib/utils';

const licenseAtom = userDataFamily('driversLicense');
const hasLicenseAtom = atom(
  (get) => get(licenseAtom) != null,
  (_get, set, hasLicense: boolean) => {
    if (hasLicense) {
      set(licenseAtom, {});
    } else {
      set(licenseAtom, null);
    }
  }
);

export default function OtherIdentification() {
  const [hasLicense, setHasLicense] = useAtom(hasLicenseAtom);
  const setLicenseNumber = useSetAtom(userDataFamily('driversLicense.number'));
  const setLicenseState = useSetAtom(userDataFamily('driversLicense.state'));

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          hasDriversLicense: null,
        }}
        onSubmit={({ hasDriversLicense }) => {
          setHasLicense(hasDriversLicense);

          return true;
        }}
        pageId='has-drivers-license'
        schema={z.object({
          hasDriversLicense: required(z.boolean().nullable()),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='hasDriversLicense'>
              <QuizFieldTitle />
              <FormBooleanInput />
            </FormField>
          </FormBlock>
        )}
      </QuizPage>

      {hasLicense && (
        <QuizPage
          defaultValues={{
            number: '',
            state: '',
          }}
          onSubmit={({ number, state }) => {
            setLicenseNumber(number);
            setLicenseState(state);

            return true;
          }}
          pageId='drivers-license-details'
          schema={z.object({
            number: z.string().nonempty(),
            state: z.string().nonempty(),
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
                <FormField control={control} name='state'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>
      )}

      <QuizPage
        defaultValues={{
          hasSsn: null,
        }}
        onSubmit={() => true}
        pageId='social-security'
        schema={z.object({
          hasSsn: required(z.boolean().nullable()),
          ssnNumber: z.string().nonempty().optional(),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormBlock>
              <FormField control={control} name='hasSsn'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormFieldBlock
              active={!!watch('hasSsn')}
              activeValue=''
              control={control}
              name='ssnNumber'
            >
              <QuizFieldTitle />
              <QuizTextInput />
            </ConditionalFormFieldBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
