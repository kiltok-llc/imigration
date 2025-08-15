import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { TransButton } from '@/components/trans';

export function LanguageButton({ language }: { language: string }) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const active = language === i18n.language;

  return (
    <TransButton
      contentStyle={tw`flex-row-reverse justify-between gap-2`}
      i18nKey={`language.${language}`}
      icon={({ size }) => (
        <Feather
          color={active ? theme.colors.secondary : theme.colors.outline}
          name={active ? 'check-circle' : 'circle'}
          size={size}
        />
      )}
      labelStyle={tw.style('text-2xl', active && 'font-semibold')}
      mode='outlined'
      onPress={() => void i18n.changeLanguage(language)}
      style={tw.style(
        {
          backgroundColor: theme.colors.surface,
        },
        active && {
          borderColor: theme.colors.secondary,
          borderWidth: 2,
        }
      )}
    />
  );
}
