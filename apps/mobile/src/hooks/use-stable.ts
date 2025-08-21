import { isEqual } from '@ver0/deep-equal';
import { useRef } from 'react';

export const useStable = <T>(value: T) => {
  const ref = useRef<T>(value);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

export const useStableRef = <T>(value: T) => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};
