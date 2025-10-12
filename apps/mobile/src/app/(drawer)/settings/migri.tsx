import * as Speech from 'expo-speech';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-paper';
import tw from 'twrnc';

import {
  SettingsItem,
  SettingsPage,
  SettingsScreen,
  SettingsSection,
} from '@/components/settings';
import { Trans } from '@/components/trans';
import { useQuery } from '@/hooks/use-rn-query';
import { isMigriTriggersEnabledAtom, migriVoiceAtom } from '@/lib/migri';
import { useSettingsPath } from '@/lib/settings';
import { useT } from '@/lib/translation';

export default function Migri() {
  const {
    i18n: { language },
  } = useTranslation();
  const path = useSettingsPath();
  const { data: voices = [] } = useQuery({
    meta: {
      errorToastKey: `${path}.toast.voices-error`,
    },
    queryFn: Speech.getAvailableVoicesAsync,
    queryKey: ['voices'],
    select: (voices) =>
      voices
        .filter((voice) => voice.language.startsWith(language))
        .sort((a, b) => a.name.localeCompare(b.name)),
    staleTime: Infinity,
  });

  return (
    <SettingsScreen>
      <SettingsPage>
        <SettingsSection id='migri-tutorials'>
          <TriggerTutorialsItem />
        </SettingsSection>
        <SettingsSection id='migri-voice'>
          <MigriVoiceItem name={null} voice={null} />
          {voices.map((voice) => (
            <MigriVoiceItem
              key={voice.identifier}
              name={voice.name}
              voice={voice.identifier}
            />
          ))}
        </SettingsSection>
      </SettingsPage>
    </SettingsScreen>
  );
}

function MigriVoiceItem({
  name,
  voice,
}: {
  name: null | string;
  voice: null | string;
}) {
  const t = useT();
  const {
    i18n: { language },
  } = useTranslation();
  const countryCode =
    voice === null ? 'default' : voice?.match(`${language}-[A-Z]{2}`)?.[0];
  const path = useSettingsPath();
  const [activeVoice, setActiveVoice] = useAtom(migriVoiceAtom);
  const onPress = async () => {
    setActiveVoice(voice);
    await Speech.stop();
    Speech.speak(t(`${path}.utterance`), {
      language,
      voice: voice ?? undefined,
    });
  };

  return (
    <SettingsItem
      contentStyle={tw`h-8`}
      icon={activeVoice === voice ? 'check' : undefined}
      onPress={() => void onPress()}
      title={
        <Trans
          context={countryCode}
          i18nKey={`${path}.options.title`}
          values={{ name }}
        />
      }
    />
  );
}

function TriggerTutorialsItem() {
  const [isTriggersEnabled, setIsTriggersEnabled] = useAtom(
    isMigriTriggersEnabledAtom
  );

  return (
    <SettingsItem
      id='trigger-tutorials'
      onPress={undefined}
      right={() => (
        <Switch
          onValueChange={setIsTriggersEnabled}
          value={isTriggersEnabled}
        />
      )}
    />
  );
}
