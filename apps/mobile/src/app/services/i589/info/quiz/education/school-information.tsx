import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { RadioButton, TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function SchoolInformation() {
  const { t } = useTranslation();
  const [schoolName, setSchoolName] = useAtom(answerFamily('schoolName'));
  const [schoolLevel, setSchoolLevel] = useAtom(answerFamily('schoolLevel'));
  const [schoolCity, setSchoolCity] = useAtom(answerFamily('schoolCity'));
  const [schoolState, setSchoolState] = useAtom(answerFamily('schoolState'));
  const [schoolCountry, setSchoolCountry] = useAtom(
    answerFamily('schoolCountry')
  );
  const [schoolFrom, setSchoolFrom] = useAtom(answerFamily('schoolFrom'));
  const [schoolTo, setSchoolTo] = useAtom(answerFamily('schoolTo'));

  const schoolLevelOptions = [
    'Elementary or Primary',
    'Secondary',
    'Vocational/Technical',
    'University',
  ];

  return (
    <Quiz>
      {/* Page 1: Basic School Information */}
      <QuizPage
        onSubmit={() => {
          if (!schoolName || !schoolLevel) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.education.school-information.title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.education.school-information.school_name'
          )}
          onChangeText={setSchoolName}
          value={schoolName}
        />

        <FormLabel>
          <Trans i18nKey='services.i589.info.education.school-information.school_level' />
        </FormLabel>
        <RadioButton.Group
          onValueChange={(value) => setSchoolLevel(value as any)}
          value={schoolLevel || ''}
        >
          {schoolLevelOptions.map((option) => (
            <RadioButton.Item
              key={option}
              label={t(
                `services.i589.info.education.school-information.school_level_options.${option.toLowerCase().replaceAll(' ', '_')}`
              )}
              value={option}
            />
          ))}
        </RadioButton.Group>
      </QuizPage>

      {/* Page 2: School Location */}
      <QuizPage
        onSubmit={() => {
          if (!schoolCity || !schoolCountry) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.education.school-information.location_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.education.school-information.school_city'
          )}
          onChangeText={setSchoolCity}
          value={schoolCity}
        />

        <TextInput
          label={t(
            'services.i589.info.education.school-information.school_state'
          )}
          onChangeText={setSchoolState}
          value={schoolState}
        />

        <TextInput
          label={t(
            'services.i589.info.education.school-information.school_country'
          )}
          onChangeText={setSchoolCountry}
          value={schoolCountry}
        />
      </QuizPage>

      {/* Page 3: Attendance Period */}
      <QuizPage
        onSubmit={() => {
          if (!schoolFrom || !schoolTo) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.education.school-information.attendance_period_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.education.school-information.school_from'
          )}
          onChangeText={setSchoolFrom}
          placeholder='MM/YYYY'
          value={schoolFrom}
        />

        <TextInput
          label={t('services.i589.info.education.school-information.school_to')}
          onChangeText={setSchoolTo}
          placeholder='MM/YYYY'
          value={schoolTo}
        />
      </QuizPage>
    </Quiz>
  );
}
