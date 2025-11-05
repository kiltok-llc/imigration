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

  return [
    'Language:',
    `- The user speaks ${languageName}, and may not understand other languages!`,
    `- VERY VERY IMPORTANT: ONLY RESPOND IN ${languageName}.`,
  ].join('\n');
};
