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
    'Language Control:',
    '- The app settings control the language.',
    `- The active language is ${languageName}.`,
    '- Always respond in the active language.',
  ].join('\n');
};
