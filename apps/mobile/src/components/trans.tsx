import { ComponentProps } from 'react';
import { Trans as I18NTrans } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import { Text } from 'react-native';

export function Trans({
  ...props
}: Omit<ComponentProps<typeof I18NTrans>, 'components'>) {
  // TODO this might not update when we change the language: https://react.i18next.com/latest/trans-component#important-note
  return (
    <I18NTrans
      components={{
        italic: <Text style={{ fontStyle: 'italic' }} />,
        pre: <Text style={{ fontFamily: 'monospace' }} />,
        strong: <Text style={{ fontWeight: 'bold' }} />,
      }}
      parent={Text}
      {...props}
    />
  );
}
