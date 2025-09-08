import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { ComponentProps, useRef, useState } from 'react';
import { TextInput as NativeTextInput, View, ViewStyle } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { useFormField } from '@/components/form/field';
import { FormCommaListInput, FormTextInput } from '@/components/form/text';
import { useQuizFieldKey } from '@/components/quiz/hooks';
import { useSpeechLanguage } from '@/lib/speech';
import { useT } from '@/lib/translation';

export function QuizCommaListInput({
  ...props
}: Omit<ComponentProps<typeof FormCommaListInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return <FormCommaListInput i18nKey={i18nKey} {...props} />;
}

export function QuizLongTextInput({
  ...props
}: Omit<ComponentProps<typeof FormTextInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');
  const {
    field: { onBlur, onChange, value },
  } = useFormField();
  const ref = useRef<NativeTextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <FormTextInput
        i18nKey={i18nKey}
        multiline={true}
        onBlur={() => {
          setFocused(false);
          onBlur();
        }}
        onFocus={() => setFocused(true)}
        ref={ref}
        scrollEnabled={false}
        style={tw`min-h-60`}
        {...props}
      ></FormTextInput>
      {!focused && (
        <VoiceRecognitionButton
          setValue={onChange}
          style={tw`absolute top-2 right-2`}
          value={value}
        />
      )}
    </View>
  );
}

export function QuizTextInput({
  ...props
}: Omit<ComponentProps<typeof FormTextInput>, 'i18nKey'>) {
  const i18nKey = useQuizFieldKey('label');

  return <FormTextInput i18nKey={i18nKey} scrollEnabled={false} {...props} />;
}

const MIN_SCALE = 1;
const MAX_SCALE = 1.8;

// https://github.com/jamsch/expo-speech-recognition?tab=readme-ov-file#speech-recognition-events
const ANIMATION_THRESHOLD = 2;
const MIN_VOLUME = -2;
const MAX_VOLUME = 10;

export function VoiceRecognitionButton({
  setValue,
  style,
  value,
}: {
  setValue: (value: string) => void;
  style?: ViewStyle;
  value: string;
}) {
  const t = useT();
  const theme = useTheme();

  const speechLanguage = useSpeechLanguage();
  const [recording, setRecording] = useState(false);
  const startingValueRef = useRef<string>('');

  const volumeScale = useSharedValue(MIN_SCALE);
  const pulseScale = useSharedValue(MIN_SCALE);
  const pulseOpacity = useSharedValue(0);

  const reset = () => {
    volumeScale.value = MIN_SCALE;
    pulseScale.value = MIN_SCALE;
    pulseOpacity.value = 0;
  };

  useSpeechRecognitionEvent('start', () => {
    startingValueRef.current = value;
    if (value.length > 0 && value.at(-1) !== ' ') {
      startingValueRef.current += ' ';
    }

    reset();
    setRecording(true);
  });

  useSpeechRecognitionEvent('end', () => {
    reset();
    setRecording(false);
  });

  useSpeechRecognitionEvent('result', ({ results }) => {
    const transcript = results[0]?.transcript ?? '';
    setValue(startingValueRef.current + transcript);
  });

  useSpeechRecognitionEvent('error', ({ error }) => {
    console.debug('Speech error:', error);
    toast.warning(t([`speech.error.${error}`, 'speech.error.unknown']));
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    if (event.value < ANIMATION_THRESHOLD) {
      return;
    }

    const newScale = interpolate(
      event.value,
      [MIN_VOLUME, MAX_VOLUME],
      [MIN_SCALE, MAX_SCALE],
      Extrapolation.CLAMP
    );

    volumeScale.value = withSequence(
      withSpring(newScale, {
        damping: 10,
        stiffness: 150,
      }),
      withTiming(MIN_SCALE, { duration: 300 })
    );

    if (pulseOpacity.value <= 0) {
      pulseScale.value = MIN_SCALE;
      pulseOpacity.value = 1;
      pulseScale.value = withTiming(MAX_SCALE, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
      pulseOpacity.value = withTiming(0, { duration: 1000 });
    }
  });

  const volumeScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: volumeScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const handleSpeech = async () => {
    if (recording) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      toast.error(t('permission.speech.denied'));
      return;
    }

    ExpoSpeechRecognitionModule.start({
      addsPunctuation: true,
      continuous: true,
      interimResults: true,
      lang: speechLanguage,
      volumeChangeEventOptions: {
        enabled: true,
        intervalMillis: 100,
      },
    });
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={style}>
      <Animated.View
        style={[
          tw.style('absolute inset-1 rounded-full', {
            backgroundColor: theme.colors.surfaceDisabled,
          }),
          volumeScaleStyle,
        ]}
      />
      <Animated.View
        style={[
          tw.style('absolute inset-1 rounded-full border', {
            borderColor: theme.colors.secondary,
          }),
          pulseStyle,
        ]}
      />
      <IconButton
        icon={recording ? 'microphone' : 'microphone-outline'}
        onPress={() => void handleSpeech()}
      />
    </Animated.View>
  );
}
