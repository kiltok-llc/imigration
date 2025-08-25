import { createContext, useContext } from 'react';

import { useLocalSegments } from '@/hooks/use-local-segments';

export const SectionContext = createContext<string | undefined>(undefined);
export const useSettingsSection = () => useContext(SectionContext);
export const useSettingsPath = () => {
  const path = useLocalSegments().join('.');
  const section = useSettingsSection();
  if (!section) {
    return path;
  }
  return `${path}.sections.${section}`;
};
