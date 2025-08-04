import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { Trans } from '@/components/trans';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { QuizPrimaryQuestionText } from '@/components/ui/quiz/ui';
import { BooleanRadioGroup } from '@/components/ui/radio';
import { quizAnswerFamily } from '@/lib/services/i589/eligibility';

export default function PreviousApplications() {
  const router = useRouter();
  const { t } = useTranslation();
  const [hasPreviousApp, setHasPreviousApp] = useAtom(
    quizAnswerFamily('hasPreviousApp')
  );

  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          if (hasPreviousApp === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (hasPreviousApp) {
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <QuizPrimaryQuestionText>
          <Trans i18nKey='services.i589.eligibility.previous-applications.has-previous-app' />
        </QuizPrimaryQuestionText>
        <BooleanRadioGroup
          onChange={setHasPreviousApp}
          value={hasPreviousApp}
        />
      </QuizPage>
    </Quiz>
  );
}
