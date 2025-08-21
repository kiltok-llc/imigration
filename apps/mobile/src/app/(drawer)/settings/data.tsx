import * as React from 'react';

import {
  SettingsPage,
  SettingsScreen,
  SettingsSection,
} from '@/components/settings';

export default function Language() {
  return (
    <SettingsScreen>
      <SettingsPage>
        <SettingsSection id='user'></SettingsSection>
      </SettingsPage>
    </SettingsScreen>
  );
}
