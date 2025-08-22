import { ExpoDevMenuItem, isDevelopmentBuild, registerDevMenuItems } from 'expo-dev-client';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { PropsWithChildren, useEffect } from 'react';

import { defaultStorage, quizStorage, userStorage } from '@/lib/mmkv';

const devMenuItemsAtom = atom<ExpoDevMenuItem[]>([
  {
    callback: () => {
      defaultStorage.clearAll();
      userStorage.clearAll();
      quizStorage.clearAll();
    },
    name: 'Clear Storage',
  },
]);

export const useDevMenuItem = (itemCallback: () => ExpoDevMenuItem) => {
  const setDevMenuItems = useSetAtom(devMenuItemsAtom);

  useEffect(() => {
    if (!isDevelopmentBuild()) {
      return;
    }

    const item = itemCallback();

    setDevMenuItems((items) => [...items, item]);

    return () => {
      setDevMenuItems((items) => items.filter((i) => i !== item));
    };
  }, [itemCallback, setDevMenuItems]);
};

export function DevMenuProvider({ children }: PropsWithChildren) {
  const items = useAtomValue(devMenuItemsAtom);

  useEffect(() => {
    if (!isDevelopmentBuild()) {
      return;
    }

    void registerDevMenuItems(items);
  }, [items]);

  return children;
}