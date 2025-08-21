import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      buttonColor={theme.colors.surface}
      contentStyle={tw`flex-row-reverse justify-between gap-2`}
      i18nKey={`language.${language}`}
      icon={({ size }) => (
        <MaterialCommunityIcons
          color={active ? theme.colors.secondary : theme.colors.outline}
          name={active ? 'checkbox-marked-circle-outline' : 'circle-outline'}
          size={size * 1.2}
        />
      )}
      labelStyle={tw.style('text-2xl', active && 'font-semibold')}
      mode='outlined'
      onPress={() => void i18n.changeLanguage(language)}
      style={tw.style(
        'border-2',
        active && {
          borderColor: theme.colors.secondary,
        }
      )}
    />
  );
}
