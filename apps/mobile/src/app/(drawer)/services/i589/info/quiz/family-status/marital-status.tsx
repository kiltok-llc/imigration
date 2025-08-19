import { useAtom, useSetAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import {
  DEFAULT_RANGE,
  FormRangeInput,
  RangeSchema,
  RangeSchemaWithOptionalEnd,
} from '@/components/form/range';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { userDataAtom, userDataFamily } from '@/lib/data/user';
import { MaritalStatusEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

const marriageCertificateAtom = focusAtom(userDataAtom, (optic) =>
  optic
    .prop('marriage')
    .valueOr({
      certificate: undefined,
    })
    .prop('certificate')
);

const spouseNameAtom = focusAtom(userDataAtom, (optic) =>
  optic.prop('spouse').valueOr({ name: undefined }).prop('name')
);

const marriageInfoAtom = focusAtom(userDataAtom, (optic) =>
  optic
    .prop('marriage')
    .valueOr({
      city: undefined,
      country: undefined,
      range: undefined,
    })
    .pick(['country', 'city', 'range'])
);

export default function MaritalStatus() {
  const [maritalStatus, setMaritalStatus] = useAtom(
    userDataFamily('maritalStatus')
  );
  const setMarriageCertificate = useSetAtom(marriageCertificateAtom);
  const setMarriageInfo = useSetAtom(marriageInfoAtom);
  const setSpouseName = useSetAtom(spouseNameAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          status: null,
        }}
        onSubmit={({ status }) => {
          setMaritalStatus(status);

          return true;
        }}
        pageId='marital-status'
        schema={z.object({
          status: required(MaritalStatusEnum.nullable()),
        })}
      >
        {({ control }) => (
          <>
            <FormBlock>
              <FormField control={control} name='status'>
                <QuizFieldTitle />
                <FormRadioGroup>
                  {MaritalStatusEnum.options.map((status) => (
                    <QuizRadioItem key={status} value={status} />
                  ))}
                </FormRadioGroup>
              </FormField>
            </FormBlock>
          </>
        )}
      </QuizPage>

      {maritalStatus !== 'single' && (
        <QuizPage
          defaultValues={{
            hasCertificate: null,
          }}
          onSubmit={({ certificate }) => {
            if (certificate) {
              setMarriageCertificate(certificate);
            }

            return true;
          }}
          pageId='marriage-certificate'
          schema={z.object({
            certificate: required(z.string().nullable()).optional(),
            hasCertificate: required(z.boolean().nullable()),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormField control={control} name='hasCertificate'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>

              <ConditionalFormFieldBlock
                active={!!watch('hasCertificate')}
                activeValue={null}
                control={control}
                name='certificate'
              >
                <QuizFieldTitle />
                <FormImageInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>
      )}

      {maritalStatus !== 'single' && (
        <QuizPage
          defaultValues={{
            city: '',
            country: '',
            range: DEFAULT_RANGE,
          }}
          onSubmit={({ city, country, range }) => {
            setMarriageInfo({ city, country, range });

            return true;
          }}
          pageId='marriage-info'
          schema={z.object({
            city: z.string().nonempty(),
            country: z.string().nonempty(),
            range:
              maritalStatus === 'divorced'
                ? RangeSchema
                : RangeSchemaWithOptionalEnd,
          })}
        >
          {({ control, lens }) => (
            <>
              <FormBlock>
                <QuizFieldTitle name='location' />
                <FormField control={control} name='city'>
                  <QuizTextInput />
                </FormField>
                <FormField control={control} name='country'>
                  <QuizTextInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='range'>
                  <QuizFieldTitle />

                  {maritalStatus === 'divorced' ? (
                    <FormRangeInput lens={lens.focus('range')} />
                  ) : (
                    <FormField control={control} name='range.start'>
                      <QuizDateInput />
                    </FormField>
                  )}
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>
      )}

      {maritalStatus !== 'single' && (
        <QuizPage
          defaultValues={DEFAULT_NAME}
          onSubmit={(name) => {
            setSpouseName(name);

            return true;
          }}
          pageId='spouse-info'
          schema={NameSchema}
        >
          {({ lens }) => (
            <TranslationContextProvider value={{ context: maritalStatus }}>
              <FormBlock>
                <QuizPageTitle />
                <FormNameInput lens={lens} />
              </FormBlock>
            </TranslationContextProvider>
          )}
        </QuizPage>
      )}
    </QuizScreen>
  );
}
