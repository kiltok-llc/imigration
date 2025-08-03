import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';

export function ConfettiPortal() {
  const { height, width } = useWindowDimensions();
  const { confetti } = useLocalSearchParams<{ confetti?: string }>();
  const show = confetti === 'true';
  const router = useRouter();

  if (!show) {
    return null;
  }

  return (
    <Confetti
      autoplay={true}
      blastDuration={600}
      cannonsPositions={[
        { x: -30, y: height },
        { x: width + 30, y: height },
      ]}
      count={300}
      fallDuration={3000}
      isInfinite={false}
      onAnimationEnd={() => router.setParams({ confetti: undefined })}
      sizeVariation={0.3}
      verticalSpacing={60}
    />
  );
}
