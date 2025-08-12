import { isDevelopmentBuild, registerDevMenuItems } from 'expo-dev-client';
import { atom, Getter, Setter, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { resetAllQuizPages } from '@/atoms/quiz-page-family';
import { resetAllQuizValues } from '@/atoms/quiz-values-family';
import { defaultStorage } from '@/lib/mmkv';

const devMenuItemAtom = (
  id: string,
  name: string,
  callback: (get: Getter, set: Setter) => void,
  { shouldCollapse = true }: { shouldCollapse?: boolean } = {},
) => atom({ callback, id, name, shouldCollapse });

const clearQuizStorageAtom = devMenuItemAtom(
  'clear-quiz-storage',
  'Clear Quiz Storage',
  () => {
    resetAllQuizValues();
    resetAllQuizPages();
  },
);

const clearStorageAtom = devMenuItemAtom(
  'clear-storage',
  'Clear Storage',
  () => {
    defaultStorage.clearAll();
  },
);

const devMenuItemsAtom = atom(
  (get) => ([
    clearQuizStorageAtom,
    clearStorageAtom,
  ].map((atom) => get(atom))),
);

const invokeDevMenuItemAtom = atom(
  null,
  (get, set, id: string) => {
    const { callback } = get(devMenuItemsAtom)
      .find((item) => item.id === id)!;

    callback(get, set);
  },
);


export const useRegisterDevMenuItems = () => {
  const devMenuItems = useAtomValue(devMenuItemsAtom);
  const invokeDevMenuItem = useSetAtom(invokeDevMenuItemAtom);

  const register = useCallback(() =>
    registerDevMenuItems(
      devMenuItems.map(({ id, name, shouldCollapse }) => ({
        callback: () => invokeDevMenuItem(id),
        name,
        shouldCollapse,
      })),
    ), [devMenuItems, invokeDevMenuItem],
  );

  useEffect(() => {
    if (!isDevelopmentBuild()) {
      return;
    }

    void register();
  }, [register]);
};
