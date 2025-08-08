import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function NameAndAliases() {
  const { t } = useTranslation();
  const [lastName, setLastName] = useAtom(answerFamily('lastName'));
  const [firstName, setFirstName] = useAtom(answerFamily('firstName'));
  const [middleName, setMiddleName] = useAtom(answerFamily('middleName'));
  const [maidenName, setMaidenName] = useAtom(answerFamily('maidenName'));
  const [otherNames, setOtherNames] = useAtom(answerFamily('otherNames'));
  const [hasAlias, setHasAlias] = useAtom(answerFamily('hasAlias'));
  const [aliasName, setAliasName] = useAtom(answerFamily('aliasName'));

  return (
    <Quiz>
      {/* Page 1: Basic Name Information */}
      <QuizPage
        onSubmit={() => {
          if (!lastName || !firstName) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.name-and-aliases.last_name'
          )}
          onChangeText={setLastName}
          value={lastName}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.name-and-aliases.first_name'
          )}
          onChangeText={setFirstName}
          value={firstName}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.name-and-aliases.middle_name'
          )}
          onChangeText={setMiddleName}
          value={middleName}
        />
      </QuizPage>

      {/* Page 2: Additional Name Information */}
      <QuizPage
        onSubmit={() => {
          return true; // These fields are optional
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.additional_names_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.name-and-aliases.maiden_name'
          )}
          onChangeText={setMaidenName}
          value={maidenName}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.name-and-aliases.other_names'
          )}
          onChangeText={setOtherNames}
          value={otherNames}
        />
      </QuizPage>

      {/* Page 3: Alias Information */}
      <QuizPage
        onSubmit={() => {
          if (hasAlias === true && !aliasName) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.alias_title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.name-and-aliases.used_alias' />
        </FormLabel>
        <FormBooleanInput onChange={setHasAlias} value={hasAlias} />

        <FadeView visible={hasAlias === true}>
          <TextInput
            label={t(
              'services.i589.info.personal-information.name-and-aliases.alias_name'
            )}
            onChangeText={setAliasName}
            value={aliasName}
          />
        </FadeView>
      </QuizPage>
    </Quiz>
  );
}
