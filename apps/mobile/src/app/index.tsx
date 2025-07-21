import { Redirect } from 'expo-router';
import { useMMKVBoolean } from 'react-native-mmkv';

import { storage } from '@/lib/mmkv';

export default function Index() {
  const [isOnBoarded = false] = useMMKVBoolean('isOnBoarded', storage);

  if (__DEV__) {
    return <Redirect href='/forms/personal-info/form' />;
  }

  if (!isOnBoarded) {
    return <Redirect href='/onboarding' />;
  }

  return <Redirect href='/home' />;
}
