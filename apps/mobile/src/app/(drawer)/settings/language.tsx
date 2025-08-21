import * as React from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';

import {
  SettingsItem,
  SettingsPage,
  SettingsScreen,
  SettingsSection,
} from '@/components/settings';
import { Trans } from '@/components/trans';

export default function Language() {
  return (
    <SettingsScreen>
      <SettingsPage>
        <SettingsSection id='languages'>
          <LanguageItem language='en' />
          <LanguageItem language='es' />
        </SettingsSection>
      </SettingsPage>
    </SettingsScreen>
  );
}

function LanguageItem({ language }: { language: string }) {
  const { i18n } = useTranslation();
  return (
    <SettingsItem
      contentStyle={tw`h-8`}
      icon={i18n.language === language ? 'check' : undefined}
      onPress={() => void i18n.changeLanguage(language)}
      title={<Trans i18nKey={`language.${language}`} />}
    ></SettingsItem>
  );
}
