import { createContext, PropsWithChildren, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContextContext = createContext<Record<string, any>>({});

export function TranslationContextProvider({
  children,
  value,
}: PropsWithChildren<{ value: Record<string, any> }>) {
  const options = useTranslationContext();

  return (
    <TranslationContextContext.Provider value={{ ...options, ...value }}>
      {children}
    </TranslationContextContext.Provider>
  );
}

export const useTranslationContext = () =>
  useContext(TranslationContextContext);
export const useT = (optionsHookParam?: Record<string, any>) => {
  const { t } = useTranslation();
  const optionsContext = useTranslationContext();

  return (key: string | string[], optionsFuncParam?: Record<string, any>) => {
    const combined = {
      ...optionsContext,
      ...optionsHookParam,
      ...optionsFuncParam,
    };
    return t(key, { ...combined.values, ...combined }) as string;
  };
};
