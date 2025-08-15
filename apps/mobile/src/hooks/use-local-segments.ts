import { useIsFocused } from '@react-navigation/native';
import { useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

export function useLocalSegments({
  groups = false,
}: { groups?: boolean } = {}): string[] {
  const segments = useSegments(); // current global/focused segments
  const isFocused = useIsFocused(); // whether *this* screen is focused now
  const lastFocused = useRef<string[]>(segments);

  useEffect(() => {
    if (isFocused) {
      lastFocused.current = segments;
    }
  }, [isFocused, segments]);

  let filteredSegments = lastFocused.current;

  if (!groups) {
    filteredSegments = segments.filter(
      (segment) => !segment.startsWith('(') && !segment.endsWith(')')
    );
  }

  return filteredSegments;
}
