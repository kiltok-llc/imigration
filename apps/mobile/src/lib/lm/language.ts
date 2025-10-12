import { useTranslation } from 'react-i18next';

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
};

export const useLanguagePrompt = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const languageName = LANGUAGES[language as unknown as keyof typeof LANGUAGES];

  return [`VERY VERY IMPORTANT: Respond in ${languageName}.`].join('\n');
};
