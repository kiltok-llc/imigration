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
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormImageInput } from '@/components/form/image';
import { FormBooleanInput, FormSexInput } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFormPage } from '@/components/quiz/form-page';
import { QuizFieldTitle } from '@/components/quiz/label';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
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
import { SexEnum } from '@/lib/schemas';
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
      <QuizFormPage
        defaultValues={{
          sex: null,
        }}
        onSuccess={({ sex }) => {
          setSex(sex);
        }}
        pageId='sex'
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
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          date: null,
          location: DEFAULT_FORM_SHORT_ADDRESS,
        }}
        onSuccess={({ date, location }) => {
          setBirthLocation(location);
          setDob(date);
        }}
        pageId='birth'
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
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          birthNationality: '',
          currentNationality: '',
        }}
        onSuccess={({ birthNationality, currentNationality }) => {
          setBirthNationality(birthNationality);
          setNationality(currentNationality);
        }}
        pageId='nationality'
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
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          ethnicity: '',
          religion: '',
        }}
        onSuccess={({ ethnicity, religion }) => {
          setEthnicity(ethnicity);
          setReligion(religion);
        }}
        pageId='additional-info'
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
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          hasBirthCertificate: null,
        }}
        onSuccess={({ image }) => {
          attachBirthCertificate(image ? new File(image) : null);
        }}
        pageId='birth-certificate'
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
      </QuizFormPage>
    </QuizScreen>
  );
}
