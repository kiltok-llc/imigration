import { useRef } from 'react';

export const useLatestRef = <T>(value: T) => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};
