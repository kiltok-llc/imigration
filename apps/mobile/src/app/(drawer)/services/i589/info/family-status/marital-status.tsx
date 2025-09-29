import { useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import {
  DEFAULT_FORM_SHORT_ADDRESS,
  EXAMPLE_SHORT_ADDRESS,
  FormShortAddressInput,
  FormShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import {
  DEFAULT_FORM_NAME,
  FormNameInput,
  FormNameSchema,
} from '@/components/form/name';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizScreen } from '@/components/quiz/screen';
import {
  divorceDateAtom,
  maritalStatusAtom,
  marriageCertificateAtom,
  marriageDateAtom,
  marriageLocationAtom,
} from '@/lib/data/marriage';
import { DEFAULT_LOCATION } from '@/lib/data/schema';
import {
  spouseIsInUsaAtom,
  spouseLocationAtom,
  spouseNameAtom,
} from '@/lib/data/spouse';
import { MaritalStatusEnum } from '@/lib/schemas';
import { required } from '@/lib/utils';

export default function MaritalStatus() {
  const [maritalStatus, setMaritalStatus] = useAtom(maritalStatusAtom);
  const setMarriageCertificate = useSetAtom(marriageCertificateAtom);
  const setMarriageLocation = useSetAtom(marriageLocationAtom);
  const setMarriageDate = useSetAtom(marriageDateAtom);
  const setDivorceDate = useSetAtom(divorceDateAtom);
  const setSpouseName = useSetAtom(spouseNameAtom);
  const setSpouseIsInUsa = useSetAtom(spouseIsInUsaAtom);
  const setSpouseLocation = useSetAtom(spouseLocationAtom);

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          status: null,
        }}
        onSuccess={({ status }) => {
          setMaritalStatus(status);
        }}
        pageId='marital-status'
        sampleData={{
          example: {
            status: 'married',
          },
        }}
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

      {maritalStatus === 'married' && (
        <QuizPage
          defaultValues={{
            hasCertificate: null,
          }}
          onSuccess={({ certificate }) => {
            if (certificate) {
              setMarriageCertificate(certificate);
            }
          }}
          pageId='marriage-certificate'
          sampleData={{
            example: {
              hasCertificate: false,
            },
          }}
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

              <ConditionalFormWrapper
                active={!!watch('hasCertificate')}
                activeValue={null}
                control={control}
                name='certificate'
              >
                <FormBlock animated>
                  <QuizFieldTitle />
                  <FormImageInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>
      )}

      {maritalStatus !== 'single' && (
        <QuizPage
          defaultValues={{
            date: null,
            divorceDate: null,
            location: DEFAULT_FORM_SHORT_ADDRESS,
          }}
          onSuccess={({ date, divorceDate, location }) => {
            setMarriageLocation(location);
            setMarriageDate(date);
            setDivorceDate(divorceDate);
          }}
          pageId='marriage-info'
          sampleData={{
            example: {
              date: new Date('2015-06-20'),
              divorceDate: null,
              location: EXAMPLE_SHORT_ADDRESS,
            },
          }}
          schema={z.object({
            date: required(z.date().nullable()),
            divorceDate:
              maritalStatus === 'divorced'
                ? required(z.date().nullable())
                : z.date().nullable(),
            location: FormShortAddressSchema,
          })}
        >
          {({ control, lens }) => (
            <>
              <FormBlock>
                <QuizFieldTitle name='location' />
                <FormShortAddressInput lens={lens.focus('location')} />
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='date'>
                  <QuizFieldTitle />
                  <QuizDateInput />
                </FormField>

                {maritalStatus === 'divorced' && (
                  <FormField control={control} name='divorceDate'>
                    <QuizDateInput />
                  </FormField>
                )}
              </FormBlock>
            </>
          )}
        </QuizPage>
      )}

      {maritalStatus === 'married' && (
        <QuizPage
          defaultValues={DEFAULT_FORM_NAME}
          onSuccess={(name) => {
            setSpouseName(name);
          }}
          pageId='spouse-info'
          sampleData={{
            example: {
              first: 'Ana',
              last: 'Smith',
              middle: 'Lucia',
            },
          }}
          schema={FormNameSchema}
        >
          {({ lens }) => (
            <FormBlock>
              <QuizPageTitle />
              <FormNameInput lens={lens} />
            </FormBlock>
          )}
        </QuizPage>
      )}

      {maritalStatus === 'married' && (
        <QuizPage
          defaultValues={{
            isInUsa: null,
          }}
          onSuccess={({ isInUsa, location }) => {
            setSpouseIsInUsa(isInUsa);
            setSpouseLocation(location ?? DEFAULT_LOCATION);
          }}
          pageId='spouse-location'
          sampleData={{
            example: {
              isInUsa: true,
              location: EXAMPLE_SHORT_ADDRESS,
            },
          }}
          schema={z.object({
            isInUsa: required(z.boolean().nullable()),
            location: FormShortAddressSchema.optional(),
          })}
        >
          {({ control, lens, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='isInUsa'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormWrapper
                active={!!watch('isInUsa')}
                activeValue={DEFAULT_LOCATION}
                control={control}
                name='location'
              >
                <FormBlock animated>
                  <QuizFieldTitle />
                  <FormShortAddressInput
                    lens={lens.focus('location').defined()}
                  />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>
      )}
    </QuizScreen>
  );
}
