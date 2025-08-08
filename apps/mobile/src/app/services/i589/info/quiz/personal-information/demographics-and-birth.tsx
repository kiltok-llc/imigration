import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function DemographicsAndBirth() {
  const { t } = useTranslation();
  const [sex, setSex] = useAtom(answerFamily('sex'));
  const [dob, setDob] = useAtom(answerFamily('dob'));
  const [birthCity, setBirthCity] = useAtom(answerFamily('birthCity'));
  const [birthCountry, setBirthCountry] = useAtom(answerFamily('birthCountry'));
  const [currentNationality, setCurrentNationality] = useAtom(
    answerFamily('currentNationality')
  );
  const [birthNationality, setBirthNationality] = useAtom(
    answerFamily('birthNationality')
  );
  const [ethnicity, setEthnicity] = useAtom(answerFamily('ethnicity'));
  const [religion, setReligion] = useAtom(answerFamily('religion'));

  // Helper function to set sex
  const handleSexChange = (value: boolean) => {
    setSex(value ? 'male' : 'female');
  };

  return (
    <Quiz>
      {/* Page 1: Basic Demographics */}
      <QuizPage
        onSubmit={() => {
          if (sex === undefined || !dob) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.demographics-and-birth.title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.demographics-and-birth.sex' />
        </FormLabel>
        <FormBooleanInput onChange={handleSexChange} value={sex === 'male'} />

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.dob'
          )}
          onChangeText={setDob}
          placeholder='MM/DD/YYYY'
          value={dob}
        />
      </QuizPage>

      {/* Page 2: Birth Location */}
      <QuizPage
        onSubmit={() => {
          if (!birthCity || !birthCountry) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.demographics-and-birth.birth_location_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.birth_city'
          )}
          onChangeText={setBirthCity}
          value={birthCity}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.birth_country'
          )}
          onChangeText={setBirthCountry}
          value={birthCountry}
        />
      </QuizPage>

      {/* Page 3: Nationality */}
      <QuizPage
        onSubmit={() => {
          if (!currentNationality || !birthNationality) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.demographics-and-birth.nationality_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.current_nationality'
          )}
          onChangeText={setCurrentNationality}
          value={currentNationality}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.birth_nationality'
          )}
          onChangeText={setBirthNationality}
          value={birthNationality}
        />
      </QuizPage>

      {/* Page 4: Additional Information (Optional) */}
      <QuizPage
        onSubmit={() => {
          return true; // These fields are optional
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.demographics-and-birth.additional_info_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.ethnicity'
          )}
          onChangeText={setEthnicity}
          value={ethnicity}
        />

        <TextInput
          label={t(
            'services.i589.info.personal-information.demographics-and-birth.religion'
          )}
          onChangeText={setReligion}
          value={religion}
        />
      </QuizPage>
    </Quiz>
  );
}
