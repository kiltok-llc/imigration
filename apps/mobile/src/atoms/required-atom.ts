import { atom } from 'jotai';
import { SetStateAction } from 'react';

export const requiredAtom = <Value>() => {
  const EMPTY = Symbol()
  const overwrittenAtom = atom<typeof EMPTY | Value>(EMPTY)

  const anAtom = atom<Value, [SetStateAction<Value>], void>(
    (get) => {
      const overwritten = get(overwrittenAtom)
      if (overwritten === EMPTY) {
        throw new Error('Atom value is required but not set')
      }
      return overwritten
    },
    (get, set, update) => {
      if (typeof update === 'function') {
        set(overwrittenAtom, (update as (prev: Value) => Value)(get(anAtom)))
      } else {
        set(overwrittenAtom, update)
      }
    }
  );

  return anAtom;
}