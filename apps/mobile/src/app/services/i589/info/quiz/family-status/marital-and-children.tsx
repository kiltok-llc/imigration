import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { RadioButton, TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function MaritalAndChildren() {
  const { t } = useTranslation();
  const [maritalStatus, setMaritalStatus] = useAtom(
    answerFamily('maritalStatus')
  );
  const [hasChildren, setHasChildren] = useAtom(answerFamily('hasChildren'));
  const [numberOfChildren, setNumberOfChildren] = useAtom(
    answerFamily('numberOfChildren')
  );

  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  return (
    <Quiz>
      {/* Page 1: Marital Status */}
      <QuizPage
        onSubmit={() => {
          if (maritalStatus === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.marital-and-children.title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.marital-and-children.marital_status' />
        </FormLabel>
        <RadioButton.Group
          onValueChange={(value) => setMaritalStatus(value as any)}
          value={maritalStatus || ''}
        >
          {maritalStatusOptions.map((option) => (
            <RadioButton.Item
              key={option}
              label={t(
                `services.i589.info.family-status.marital-and-children.marital_status_options.${option.toLowerCase()}`
              )}
              value={option}
            />
          ))}
        </RadioButton.Group>
      </QuizPage>

      {/* Page 2: Children Information */}
      <QuizPage
        onSubmit={() => {
          if (hasChildren === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (hasChildren && !numberOfChildren) {
            toast.error(t('quiz.missing'));
            return false;
          }

          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.marital-and-children.children_title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.family-status.marital-and-children.has_children' />
        </FormLabel>
        <FormBooleanInput onChange={setHasChildren} value={hasChildren} />

        <FadeView visible={hasChildren === true}>
          <TextInput
            keyboardType='numeric'
            label={t(
              'services.i589.info.family-status.marital-and-children.number_of_children'
            )}
            onChangeText={setNumberOfChildren}
            value={numberOfChildren}
          />
        </FadeView>
      </QuizPage>
    </Quiz>
  );
}
