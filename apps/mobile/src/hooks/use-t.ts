import { useTranslation } from 'react-i18next';

import { useTranslationContext } from '@/providers/translation';

export const useT = (options?: Record<string, any>) => {
  const { t } = useTranslation();
  const options_ = useTranslationContext();

  return (key: string, options__?: Record<string, any>) => {
    const combined = { ...options, ...options_, ...options__ };
    return t(key, { ...combined.values, ...combined }) as string;
  };
};
