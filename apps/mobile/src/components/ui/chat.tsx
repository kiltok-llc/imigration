import { useAtomValue } from 'jotai';
import React from 'react';
import { View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { useInterval } from 'usehooks-ts';

import { UIMessage } from '@/lib/chat/schema';
import { nameAtom } from '@/lib/data/user';

export function ChatMessage({
  message: { id, parts, role },
}: {
  message: UIMessage;
}) {
  const theme = useTheme();
  const name = useAtomValue(nameAtom).first;

  return (
    <View style={tw`gap-1`}>
      <Text
        style={tw.style(
          role === 'user' && 'self-end',
          role === 'assistant' && 'self-start',
          { color: theme.colors.onSurfaceVariant }
        )}
        variant='labelSmall'
      >
        {role === 'user' ? name : 'Migri'}
      </Text>
      <Surface
        elevation={0}
        style={tw.style(
          'max-w-4/5 rounded-3xl px-4 py-3',
          role === 'user' &&
            tw.style('self-end', {
              backgroundColor: theme.colors.secondaryContainer,
            }),
          role === 'assistant' &&
            tw.style('self-start', {
              backgroundColor: theme.colors.primary,
            })
        )}
      >
        <Text
          style={tw.style(
            role === 'user' && {
              color: theme.colors.onSecondaryContainer,
            },
            role === 'assistant' && {
              color: theme.colors.onPrimary,
            }
          )}
          variant='bodyLarge'
        >
          {parts.map((part, i) => (
            <ChatMessagePart key={`${id}-${i}`} part={part} />
          ))}
        </Text>
      </Surface>
    </View>
  );
}

export function ChatThinkingDots({
  dots = 3,
  duration = 500,
  interval = 950,
  offset = 150,
}: {
  dots?: number;
  duration?: number;
  interval?: number;
  offset?: number;
}) {
  if (dots * offset + duration > interval) {
    console.warn(
      '[ChatThinkingDots] dots * offset + duration should be <= interval'
    );
  }

  return (
    <View style={tw`flex-row items-center gap-2 p-2`}>
      {Array.from({ length: dots }).map((_, idx) => (
        <ChatThinkingDot
          delay={offset * idx}
          duration={duration}
          interval={interval}
          key={idx}
        />
      ))}
    </View>
  );
}

function ChatMessagePart({ part }: { part: UIMessage['parts'][number] }) {
  switch (part.type) {
    case 'text': {
      return <Text>{part.text}</Text>;
    }
    default: {
      return <Text>{JSON.stringify(part)}</Text>;
    }
  }
}

function ChatThinkingDot({
  bounceHeight = 4,
  delay,
  duration,
  interval,
  minOpacity = 0.8,
}: {
  bounce?: number;
  bounceHeight?: number;
  delay: number;
  duration: number;
  interval: number;
  minOpacity?: number;
}) {
  const theme = useTheme();
  const opacity = useSharedValue(minOpacity);
  const translateY = useSharedValue(0);

  useInterval(() => {
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.in(Easing.quad),
        }),
        withTiming(minOpacity, {
          duration: duration / 2,
          easing: Easing.out(Easing.quad),
        })
      )
    );

    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(-bounceHeight, {
          duration: duration / 2,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0, {
          duration: duration / 2,
          easing: Easing.in(Easing.bounce),
        })
      )
    );
  }, interval);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        tw`size-3 rounded-full`,
        {
          backgroundColor: theme.colors.onSurfaceVariant,
          opacity,
        },
        bounceStyle,
      ]}
    />
  );
}
