import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function EmploymentHistory() {
  const { t } = useTranslation();
  const [employerName, setEmployerName] = useAtom(answerFamily('employerName'));
  const [employerAddress, setEmployerAddress] = useAtom(
    answerFamily('employerAddress')
  );
  const [employerCity, setEmployerCity] = useAtom(answerFamily('employerCity'));
  const [employerState, setEmployerState] = useAtom(
    answerFamily('employerState')
  );
  const [employerCountry, setEmployerCountry] = useAtom(
    answerFamily('employerCountry')
  );
  const [occupation, setOccupation] = useAtom(answerFamily('occupation'));
  const [workFrom, setWorkFrom] = useAtom(answerFamily('workFrom'));
  const [workTo, setWorkTo] = useAtom(answerFamily('workTo'));

  return (
    <QuizScreen>
      {/* Page 1: Basic Employment Information */}
      <QuizPage
        onSubmit={() => {
          if (!employerName || !occupation) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.employment.employment-history.title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.employer_name'
          )}
          onChangeText={setEmployerName}
          value={employerName}
        />

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.occupation'
          )}
          onChangeText={setOccupation}
          value={occupation}
        />
      </QuizPage>

      {/* Page 2: Employer Location */}
      <QuizPage
        onSubmit={() => {
          if (!employerAddress || !employerCity || !employerCountry) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.employment.employment-history.employer_location_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.employer_address'
          )}
          onChangeText={setEmployerAddress}
          value={employerAddress}
        />

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.employer_city'
          )}
          onChangeText={setEmployerCity}
          value={employerCity}
        />

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.employer_state'
          )}
          onChangeText={setEmployerState}
          value={employerState}
        />

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.employer_country'
          )}
          onChangeText={setEmployerCountry}
          value={employerCountry}
        />
      </QuizPage>

      {/* Page 3: Employment Period */}
      <QuizPage
        onSubmit={() => {
          if (!workFrom || !workTo) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.employment.employment-history.employment_period_title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.employment.employment-history.work_from'
          )}
          onChangeText={setWorkFrom}
          placeholder='MM/YYYY'
          value={workFrom}
        />

        <TextInput
          label={t('services.i589.info.employment.employment-history.work_to')}
          onChangeText={setWorkTo}
          placeholder='MM/YYYY'
          value={workTo}
        />
      </QuizPage>
    </QuizScreen>
  );
}
