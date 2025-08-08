import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

export default function LanguageProficiency() {
  const { t } = useTranslation();
  const [nativeLanguage, setNativeLanguage] = useAtom(
    answerFamily('nativeLanguage')
  );
  const [speakEnglish, setSpeakEnglish] = useAtom(
    answerFamily('speaksEnglish')
  );
  const [readWriteEnglish, setReadWriteEnglish] = useAtom(
    answerFamily('canReadWriteEnglish')
  );
  const [speakSpanish, setSpeakSpanish] = useAtom(
    answerFamily('speaksSpanish')
  );
  const [readWriteSpanish, setReadWriteSpanish] = useAtom(
    answerFamily('canReadWriteSpanish')
  );
  const [otherLanguages, setOtherLanguages] = useAtom(
    answerFamily('otherLanguages')
  );

  return (
    <Quiz>
      {/* Page 1: Native Language */}
      <QuizPage
        onSubmit={() => {
          if (!nativeLanguage) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.language-proficiency.title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.personal-information.language-proficiency.native_language'
          )}
          onChangeText={setNativeLanguage}
          value={nativeLanguage}
        />
      </QuizPage>

      {/* Page 2: English Proficiency */}
      <QuizPage
        onSubmit={() => {
          if (speakEnglish === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.language-proficiency.english_proficiency_title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.language-proficiency.speak_english' />
        </FormLabel>
        <FormBooleanInput onChange={setSpeakEnglish} value={speakEnglish} />

        <FadeView visible={speakEnglish === true}>
          <FormLabel>
            <Trans i18nKey='services.i589.info.personal-information.language-proficiency.read_write_english' />
          </FormLabel>
          <FormBooleanInput
            onChange={setReadWriteEnglish}
            value={readWriteEnglish}
          />
        </FadeView>
      </QuizPage>

      {/* Page 3: Spanish and Other Languages */}
      <QuizPage
        onSubmit={() => {
          if (speakSpanish === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.language-proficiency.spanish_other_languages_title' />
        </FormLabel>

        <FormLabel>
          <Trans i18nKey='services.i589.info.personal-information.language-proficiency.speak_spanish' />
        </FormLabel>
        <FormBooleanInput onChange={setSpeakSpanish} value={speakSpanish} />

        <FadeView visible={speakSpanish === true}>
          <FormLabel>
            <Trans i18nKey='services.i589.info.personal-information.language-proficiency.read_write_spanish' />
          </FormLabel>
          <FormBooleanInput
            onChange={setReadWriteSpanish}
            value={readWriteSpanish}
          />
        </FadeView>

        <TextInput
          label={t(
            'services.i589.info.personal-information.language-proficiency.other_languages'
          )}
          onChangeText={setOtherLanguages}
          value={otherLanguages}
        />
      </QuizPage>
    </Quiz>
  );
}
