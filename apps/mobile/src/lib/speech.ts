import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atoms/atom-with-mmkv-storage';
import { defaultStorage } from '@/lib/mmkv';

export const speechLanguageOverrideAtom = atomWithMmkvStorage(
  'speech-language-override',
  null,
  z.string().nullable(),
  defaultStorage
);

export const useSpeechLanguage = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const languageOverride = useAtomValue(speechLanguageOverrideAtom);
  if (languageOverride) {
    return languageOverride;
  }

  return (
    {
      en: 'en-US',
      es: 'es-US',
    }[language] ?? 'en-US'
  );
};
