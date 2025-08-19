import { useIsFocused } from '@react-navigation/native';
import { useSegments } from 'expo-router';
import { useLayoutEffect, useRef } from 'react';

export function useLocalSegments({
  groups = false,
}: { groups?: boolean } = {}): string[] {
  const segments = useSegments(); // current global/focused segments
  const isFocused = useIsFocused(); // whether *this* screen is focused now
  const lastFocused = useRef<string[]>(segments);

  useLayoutEffect(() => {
    if (isFocused) {
      lastFocused.current = segments;
    }
  }, [isFocused, segments]);

  return lastFocused.current.filter((s) => groups || !s.startsWith('('));
}
