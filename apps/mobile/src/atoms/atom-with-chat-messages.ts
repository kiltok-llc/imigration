import { atomWithStorage } from 'jotai/utils';
import { MMKV } from 'react-native-mmkv';

import { UIMessage } from '@/lib/chat/schema';
import { createMMKVStorage } from '@/lib/jotai/create-mmkv-storage';
import { withSuperJSONStorage } from '@/lib/jotai/with-superjson-storage';

export const atomWithMMKVChatMessages = (
  key: string,
  initialValue: UIMessage[],
  storage: MMKV
) =>
  atomWithStorage(
    key,
    initialValue,
    // TODO: using AsyncStorage (via withMessageValidator) here triggers an assertion in react.
    // For now, just don't validate the messages
    // withMessageValidator(withSuperJSONStorage(createMMKVStorage(storage))),
    withSuperJSONStorage(createMMKVStorage(storage)),
    { getOnInit: true }
  );
