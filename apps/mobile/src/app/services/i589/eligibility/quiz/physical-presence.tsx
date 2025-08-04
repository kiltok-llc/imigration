import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { QuizPrimaryQuestionText } from '@/components/ui/quiz/ui';
import { BooleanRadioGroup } from '@/components/ui/radio';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function PhysicalPresence() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isInUsa, setIsInUsa] = useAtom(quizAnswerFamily('isInUsa'));

  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          if (isInUsa === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (!isInUsa) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.physical-presence.is-in-usa' />
        </QuizPrimaryQuestionText>
        <BooleanRadioGroup onChange={setIsInUsa} value={isInUsa} />
      </QuizPage>
    </Quiz>
  );
}
