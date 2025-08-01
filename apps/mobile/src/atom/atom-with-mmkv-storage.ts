import { atomWithStorage, createJSONStorage } from "jotai/utils";

import {mmkvStorage} from "@/lib/mmkv";

export const atomWithMmkvStorage = <T,>(key: string, initialValue: T) => {
  return atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage(() => mmkvStorage),
    {
      getOnInit: true,
    }
  );
}