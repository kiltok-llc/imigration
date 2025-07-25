import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormDateInput, FormLayout, FormTextInput } from '@/components/ui/form';
import { FormStep, MultiStepScreen } from '@/components/ui/multistep';

export default function Form() {
  const { t } = useTranslation();

  const handleSubmit = useCallback(async (data: unknown, name?: string) => {
    console.log('Form submitted:', data, name);
    return true;
  }, []);

  return (
    <MultiStepScreen name='personalInfo'>
      <FormStep
        formOptions={{
          defaultValues: {
            firstName: '',
            lastName: '',
          },
          resolver: standardSchemaResolver(
            z.object({
              firstName: z.string().min(1, { message: t('form.required') }),
              lastName: z.string().min(1, { message: t('form.required') }),
            })
          ),
        }}
        name='name'
        onSubmit={handleSubmit}
        title={t('personalInfo.form.name.title')}
      >
        <NameForm />
      </FormStep>

      <FormStep
        formOptions={{
          defaultValues: {
            dateOfBirth: new Date(),
          },
          resolver: standardSchemaResolver(
            z.object({
              dateOfBirth: z.date(),
            })
          ),
        }}
        name='dateOfBirt'
        onSubmit={handleSubmit}
        title={t('personalInfo.form.dateOfBirth.title')}
      >
        <DOBForm />
      </FormStep>
    </MultiStepScreen>
  );
}

function DOBForm() {
  const { t } = useTranslation();

  return (
    <FormLayout>
      <Text variant='bodyLarge'>
        <Trans i18nKey='personalInfo.form.dateOfBirth.description' />
      </Text>
      <FormDateInput
        label={t('personalInfo.form.dateOfBirth.dateOfBirth')}
        name='dateOfBirth'
      />
    </FormLayout>
  );
}

function NameForm() {
  const { t } = useTranslation();

  return (
    <FormLayout>
      <Text variant='bodyLarge'>
        <Trans i18nKey='personalInfo.form.name.description' />
      </Text>
      <FormTextInput
        autoComplete='given-name'
        label={t('personalInfo.form.name.firstName')}
        mode='outlined'
        name='firstName'
      />
      <FormTextInput
        autoComplete='family-name'
        label={t('personalInfo.form.name.lastName')}
        mode='outlined'
        name='lastName'
      />
    </FormLayout>
  );
}
