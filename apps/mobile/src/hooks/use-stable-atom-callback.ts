import { Getter, Setter, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { DependencyList, useCallback } from 'react';

type Options = Parameters<typeof useSetAtom>[1];
export const useStableAtomCallback = <Result, Args extends unknown[]>(
  callback: (get: Getter, set: Setter, ...arg: Args) => Result,
  deps: DependencyList,
  options?: Options
) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useAtomCallback(useCallback(callback, deps), options);
