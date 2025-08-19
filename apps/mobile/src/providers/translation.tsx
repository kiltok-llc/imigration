import { createContext, PropsWithChildren, useContext } from 'react';

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
