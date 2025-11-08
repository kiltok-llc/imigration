import { File } from 'expo-file-system';
import { useSetAtom } from 'jotai';
import z from 'zod/v4';

import { useAttachFile } from '@/atoms/attachment-atom';
import {
  DEFAULT_FORM_SHORT_ADDRESS,
  EXAMPLE_SHORT_ADDRESS,
  FormShortAddressInput,
  FormShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormImageInput } from '@/components/form/document';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizForm } from '@/components/quiz/form';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import { SexEnum } from '@/lib/data/schema';
import {
  birthCertificateAttachmentAtom,
  birthLocationAtom,
  birthNationalityAtom,
  dobAtom,
  ethnicityAtom,
  nationalityAtom,
  religionAtom,
  sexAtom,
} from '@/lib/data/user';
import { required } from '@/lib/utils';

export default function DemographicsAndBirth() {
  const setDob = useSetAtom(dobAtom);
  const setSex = useSetAtom(sexAtom);
  const setBirthLocation = useSetAtom(birthLocationAtom);
  const setNationality = useSetAtom(nationalityAtom);
  const setBirthNationality = useSetAtom(birthNationalityAtom);
  const setEthnicity = useSetAtom(ethnicityAtom);
  const setReligion = useSetAtom(religionAtom);
  const attachBirthCertificate = useAttachFile(birthCertificateAttachmentAtom);

  return (
    <QuizScreen>
      <QuizPage pageId='sex'>
        <QuizForm
          defaultValues={{
            sex: null,
          }}
          onSuccess={({ sex }) => {
            setSex(sex);
          }}
          sampleData={{
            example: {
              sex: 'male',
            },
          }}
          schema={z.object({
            sex: required(SexEnum.nullable()),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='sex'>
                  <QuizFieldTitle />
                  <FormSexInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='birth'>
        <QuizForm
          defaultValues={{
            date: null,
            location: DEFAULT_FORM_SHORT_ADDRESS,
          }}
          onSuccess={({ date, location }) => {
            setBirthLocation(location);
            setDob(date);
          }}
          sampleData={{
            example: {
              date: new Date('1990-05-15'),
              location: EXAMPLE_SHORT_ADDRESS,
            },
          }}
          schema={z.object({
            date: required(z.date().nullable()),
            location: FormShortAddressSchema,
          })}
        >
          {({ control, lens }) => (
            <>
              <FormBlock>
                <FormField control={control} name='date'>
                  <QuizFieldTitle />
                  <QuizDateInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <QuizFieldTitle name='location' />
                <FormShortAddressInput lens={lens.focus('location')} />
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='nationality'>
        <QuizForm
          defaultValues={{
            birthNationality: '',
            currentNationality: '',
          }}
          onSuccess={({ birthNationality, currentNationality }) => {
            setBirthNationality(birthNationality);
            setNationality(currentNationality);
          }}
          sampleData={{
            example: {
              birthNationality: 'USA',
              currentNationality: 'USA',
            },
          }}
          schema={z.object({
            birthNationality: z.string().nonempty(),
            currentNationality: z.string().nonempty(),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='birthNationality'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='currentNationality'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='additional-info'>
        <QuizForm
          defaultValues={{
            ethnicity: '',
            religion: '',
          }}
          onSuccess={({ ethnicity, religion }) => {
            setEthnicity(ethnicity);
            setReligion(religion);
          }}
          sampleData={{
            example: {
              ethnicity: 'Hispanic or Latino',
              religion: 'Christianity',
            },
          }}
          schema={z.object({
            ethnicity: z.string(),
            religion: z.string(),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='ethnicity'>
                  <QuizFieldTitle />
                  <QuizTextInput hint='optional' />
                </FormField>
              </FormBlock>

              <FormBlock>
                <FormField control={control} name='religion'>
                  <QuizFieldTitle />
                  <QuizTextInput hint='optional' />
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizForm>
      </QuizPage>

      <QuizPage pageId='birth-certificate'>
        <QuizForm
          defaultValues={{
            hasBirthCertificate: null,
          }}
          onSuccess={({ image }) => {
            attachBirthCertificate(image ? new File(image) : null);
          }}
          sampleData={{
            example: {
              hasBirthCertificate: false,
            },
          }}
          schema={z.object({
            hasBirthCertificate: required(z.boolean().nullable()),
            image: required(z.string().nullable()).optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasBirthCertificate'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormWrapper
                active={!!watch('hasBirthCertificate')}
                activeValue={null}
                control={control}
                name='image'
              >
                <FormBlock animated>
                  <QuizFieldTitle />
                  <FormImageInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizForm>
      </QuizPage>
    </QuizScreen>
  );
}
