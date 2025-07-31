import { Redirect } from 'expo-router';
import { useMMKVBoolean } from 'react-native-mmkv';

import { storage } from '@/lib/mmkv';

export default function Root() {
  const [isOnBoarded = false] = useMMKVBoolean('isOnBoarded', storage);

  if (__DEV__) {
    return <Redirect href="/services/i589/eligibility" />;
  }

  if (!isOnBoarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}
