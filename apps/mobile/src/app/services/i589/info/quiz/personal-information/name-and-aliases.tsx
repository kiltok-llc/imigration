import { useTranslation } from 'react-i18next';
import z from 'zod/v4';

import { Trans } from '@/components/trans';
import { FormField } from '@/components/ui/form/field';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { FormTextInput } from '@/components/ui/form/text';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { nullableInput } from '@/lib/utils';

export default function NameAndAliases() {
  const { t } = useTranslation();

  return (
    <Quiz>
      <QuizPage
        defaultValues={{
          firstName: '',
          lastName: '',
          middleName: '',
        }}
        onSubmit={() => true}
        pageId='basic-names'
        schema={z.object({
          firstName: z.string().nonempty(),
          lastName: z.string().nonempty(),
          middleName: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <>
            <FormLabel>
              <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.title' />
            </FormLabel>

            <FormField control={control} name='lastName'>
              <FormTextInput
                label={t(
                  'services.i589.info.personal-information.name-and-aliases.last-name'
                )}
              />
            </FormField>

            <FormField control={control} name='firstName'>
              <FormTextInput
                label={t(
                  'services.i589.info.personal-information.name-and-aliases.first-name'
                )}
              />
            </FormField>

            <FormField control={control} name='middleName'>
              <FormTextInput
                label={t(
                  'services.i589.info.personal-information.name-and-aliases.middle-name'
                )}
              />
            </FormField>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          maidenName: '',
          otherNames: '',
        }}
        onSubmit={() => {
          return true;
        }}
        pageId='additional-names'
        schema={z.object({
          maidenName: z.string(),
          otherNames: z.string(),
        })}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.additional-names-title' />
        </FormLabel>

        <FormField name='maidenName'>
          <FormTextInput
            label={t(
              'services.i589.info.personal-information.name-and-aliases.maiden-name'
            )}
          />
        </FormField>

        <FormField name='otherNames'>
          <FormTextInput
            label={t(
              'services.i589.info.personal-information.name-and-aliases.other-names'
            )}
          />
        </FormField>
      </QuizPage>

      <QuizPage
        defaultValues={{
          hasAlias: null,
        }}
        onSubmit={() => true}
        pageId='alias-information'
        schema={z.object({
          aliasName: z.string().nonempty().optional(),
          hasAlias: nullableInput(z.boolean()),
        })}
      >
        {({ control, watch }) => (
          <>
            <FormLabel>
              <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.alias-title' />
            </FormLabel>

            <FormField control={control} name='hasAlias'>
              <FormLabel variant='titleMedium'>
                <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.has-alias' />
              </FormLabel>
              <FormBooleanInput />
            </FormField>

            <FormField
              control={control}
              name='aliasName'
              visible={!!watch('hasAlias')}
            >
              <FormTextInput
                label={t(
                  'services.i589.info.personal-information.name-and-aliases.alias-name'
                )}
              />
            </FormField>
          </>
        )}
      </QuizPage>
    </Quiz>
  );
}
