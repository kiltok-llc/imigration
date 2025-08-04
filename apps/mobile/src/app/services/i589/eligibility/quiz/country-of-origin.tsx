import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { QuizPrimaryQuestionText } from '@/components/ui/quiz/ui';
import { BooleanRadioGroup } from '@/components/ui/radio';
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
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.country-of-origin.is-from-safe-country' />
        </QuizPrimaryQuestionText>
        <BooleanRadioGroup
          onChange={setIsFromSafeCountry}
          value={isFromSafeCountry}
        />
      </QuizPage>
    </Quiz>
  );
}
