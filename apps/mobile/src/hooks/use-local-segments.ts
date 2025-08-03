import { useIsFocused } from '@react-navigation/native';
import { useSegments } from 'expo-router';
import { useRef } from 'react';

export function useLocalSegments({
  groups = false,
}: { groups?: boolean } = {}): string[] {
  const segments = useSegments(); // current global/focused segments
  const isFocused = useIsFocused(); // whether *this* screen is focused now
  const lastFocused = useRef<string[]>([]);

  if (isFocused) {
    lastFocused.current = segments;
  }

  return lastFocused.current.filter((s) => groups || !s.startsWith('('));
}
