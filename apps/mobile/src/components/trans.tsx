import { ComponentProps } from 'react';
import { Trans as I18NTrans } from 'react-i18next';
import { Text as RNText } from 'react-native';
import tw from 'twrnc';

export function Trans({
  ...props
}: Omit<ComponentProps<typeof I18NTrans>, 'components'>) {
  // TODO this might not update when we change the language: https://react.i18next.com/latest/trans-component#important-note
  return (
    <I18NTrans
      components={{
        italic: <RNText style={tw`italic`} />,
        pre: <RNText style={tw`font-mono`} />,
        strong: <RNText style={tw`font-bold`} />,
      }}
      parent={RNText}
      {...props}
    />
  );
}
