import { isEqual } from '@ver0/deep-equal';
import { useRef } from 'react';

export const useStableValue = <T>(value: T) => {
  const ref = useRef<T>(value);
  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
};
