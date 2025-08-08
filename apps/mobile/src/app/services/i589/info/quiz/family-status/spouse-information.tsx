import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function SpouseInformation() {
  const { t } = useTranslation();
  const [maritalStatus] = useAtom(answerFamily('maritalStatus'));
  const [spouseMarriageDate, setSpouseMarriageDate] = useAtom(
    answerFamily('spouseMarriageDate')
  );
  const [spouseCityMarriage, setSpouseCityMarriage] = useAtom(
    answerFamily('spouseCityMarriage')
  );
  const [spouseCountryMarriage, setSpouseCountryMarriage] = useAtom(
    answerFamily('spouseCountryMarriage')
  );
  const [spouseLastName, setSpouseLastName] = useAtom(
    answerFamily('spouseLastName')
  );
  const [spouseFirstName, setSpouseFirstName] = useAtom(
    answerFamily('spouseFirstName')
  );
  const [spouseMiddleName, setSpouseMiddleName] = useAtom(
    answerFamily('spouseMiddleName')
  );

  // Skip this page if not married
  if (maritalStatus !== 'Married') {
    return null;
  }

  return (
    <Quiz>
      {/* Page 1: Marriage Information */}
      <QuizPage
        onSubmit={() => {
          if (
            !spouseMarriageDate ||
            !spouseCityMarriage ||
            !spouseCountryMarriage
          ) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.spouse-information.title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.spouse-information.marriage_info_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_marriage_date'
          )}
          onChangeText={setSpouseMarriageDate}
          placeholder='MM/DD/YYYY'
          value={spouseMarriageDate}
        />

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_city_marriage'
          )}
          onChangeText={setSpouseCityMarriage}
          value={spouseCityMarriage}
        />

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_country_marriage'
          )}
          onChangeText={setSpouseCountryMarriage}
          value={spouseCountryMarriage}
        />
      </QuizPage>

      {/* Page 2: Spouse Name */}
      <QuizPage
        onSubmit={() => {
          if (!spouseLastName || !spouseFirstName) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.spouse-information.spouse_name_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_last_name'
          )}
          onChangeText={setSpouseLastName}
          value={spouseLastName}
        />

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_first_name'
          )}
          onChangeText={setSpouseFirstName}
          value={spouseFirstName}
        />

        <TextInput
          label={t(
            'services.i589.info.family-status.spouse-information.spouse_middle_name'
          )}
          onChangeText={setSpouseMiddleName}
          value={spouseMiddleName}
        />
      </QuizPage>
    </Quiz>
  );
}
