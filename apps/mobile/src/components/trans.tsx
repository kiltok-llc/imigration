import { ComponentProps } from 'react';
import { Trans as I18NTrans } from 'react-i18next';
import { Text as NativeText } from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

import { Button } from '@/components/ui/button';
import { useTranslationContext } from '@/lib/translation';

export const transComponents = {
  italic: <NativeText style={tw`italic`} />,
  pre: <NativeText style={tw`font-mono`} />,
  strong: <NativeText style={tw`font-bold`} />,
};

// TODO this might not update when we change the language: https://react.i18next.com/latest/trans-component#important-note
export function Trans({
  ...props
}: Omit<ComponentProps<typeof I18NTrans>, 'components'>) {
  const ctx = useTranslationContext();

  return (
    <I18NTrans
      components={transComponents}
      parent={NativeText}
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
