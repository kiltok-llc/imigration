import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/eligibility';

export default function CountryOfOrigin() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFromSafeCountry, setIsFromSafeCountry] = useAtom(
    answerFamily('isFromSafeCountry')
  );

  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          if (isFromSafeCountry === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (isFromSafeCountry) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.eligibility.country-of-origin.is-from-safe-country' />
        </FormLabel>
        <FormBooleanInput
          onChange={setIsFromSafeCountry}
          value={isFromSafeCountry}
        />
      </QuizPage>
    </Quiz>
  );
}
