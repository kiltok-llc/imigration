import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import { toast } from 'sonner-native';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function USResidenceStatus() {
  const router = useRouter();
  const { t } = useTranslation();
  const [livesInUS, setLivesInUS] = useAtom(answerFamily('livesInUS'));

  return (
    <Quiz>
      <QuizPage
        onSubmit={() => {
          if (livesInUS === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (!livesInUS) {
            // If the user doesn't live in the US, they can't continue
            router.replace('../ineligible');
            return false;
          }

          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.residence.us-residence-status.title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.residence.us-residence-status.lives_in_us' />
        </FormLabel>
        <FormBooleanInput onChange={setLivesInUS} value={livesInUS} />

        <FadeView visible={livesInUS === false}>
          <Text>
            <Trans i18nKey='services.i589.info.residence.us-residence-status.us_residence_requirement' />
          </Text>
        </FadeView>
      </QuizPage>
    </Quiz>
  );
}
