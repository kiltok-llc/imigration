import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useState } from 'react';

export const useIsTransitioning = () => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  useFocusEffect(
    useCallback(() => {
      return navigation.addListener('transitionEnd', (e) => {
        if (e.data.closing) {
          return;
        }

        setIsTransitioning(false);
      });
    }, [navigation])
  );

  return isTransitioning;
};
