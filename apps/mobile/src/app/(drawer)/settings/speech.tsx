import { useAtom } from 'jotai';
import * as React from 'react';
import tw from 'twrnc';

import {
  SettingsItem,
  SettingsPage,
  SettingsScreen,
  SettingsSection,
} from '@/components/settings';
import { Trans } from '@/components/trans';
import { useSettingsPath } from '@/lib/settings';
import { speechLanguageOverrideAtom } from '@/lib/speech';

export default function Speech() {
  return (
    <SettingsScreen>
      <SettingsPage>
        <SettingsSection id='speech-language-override'>
          <SpeechOverrideItem locale={null} />
          <SpeechOverrideItem locale='en-US' />
          <SpeechOverrideItem locale='es-US' />
        </SettingsSection>
      </SettingsPage>
    </SettingsScreen>
  );
}

function SpeechOverrideItem({ locale }: { locale: null | string }) {
  const path = useSettingsPath();
  const [speechOverride, setSpeechOverride] = useAtom(
    speechLanguageOverrideAtom
  );
  return (
    <SettingsItem
      contentStyle={tw`h-8`}
      icon={speechOverride === locale ? 'check' : undefined}
      onPress={() => setSpeechOverride(locale)}
      title={
        <Trans
          i18nKey={
            locale ? `speech.locales.${locale}` : `${path}.options.default`
          }
        />
      }
    />
  );
}
