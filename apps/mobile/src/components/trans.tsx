import { ComponentProps, createContext, useContext } from 'react';
import { Trans as I18NTrans, useTranslation } from 'react-i18next';
import { Text as RNText } from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

import { Button } from '@/components/ui/button';

const TranslationContextContext = createContext<Record<string, any>>({});
export const TranslationContextProvider = TranslationContextContext.Provider;
const useTranslationContext = () => useContext(TranslationContextContext);

// TODO this might not update when we change the language: https://react.i18next.com/latest/trans-component#important-note
export function Trans({
  ...props
}: Omit<ComponentProps<typeof I18NTrans>, 'components'>) {
  const ctx = useTranslationContext();

  return (
    <I18NTrans
      components={{
        italic: <RNText style={tw`italic`} />,
        pre: <RNText style={tw`font-mono`} />,
        strong: <RNText style={tw`font-bold`} />,
      }}
      parent={RNText}
      {...props}
      {...ctx}
    />
  );
}

export function TransButton<TContext extends string | undefined = undefined>({
  context,
  count,
  i18nKey,
  values,
  ...buttonProps
}: Omit<ComponentProps<typeof Button>, 'children'> & {
  context?: TContext;
  count?: number;
  i18nKey: string;
  values?: any;
}) {
  return (
    <Button {...buttonProps}>
      <Trans
        context={context}
        count={count}
        i18nKey={i18nKey}
        values={values}
      />
    </Button>
  );
}

export function TransText<TContext extends string | undefined = undefined>({
  context,
  count,
  i18nKey,
  values,
  ...textProps
}: Omit<ComponentProps<typeof Text>, 'children'> & {
  context?: TContext;
  count?: number;
  i18nKey: string;
  values?: any;
}) {
  return (
    <Text {...textProps}>
      <Trans
        context={context}
        count={count}
        i18nKey={i18nKey}
        values={values}
      />
    </Text>
  );
}
