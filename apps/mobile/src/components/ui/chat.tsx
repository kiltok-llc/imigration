import { useAtomValue } from 'jotai';
import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import { Chip, Surface, Text, useTheme } from 'react-native-paper';
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

import { Trans } from '@/components/trans';
import { ActionChipType, UIMessage } from '@/lib/chat/schema';
import { nameAtom } from '@/lib/data/user';
import { useQuizActions } from '@/lib/quiz/actions';

export function ChatMessage({
  message: { id, parts, role },
}: {
  message: UIMessage;
}) {
  const theme = useTheme();
  const name = useAtomValue(nameAtom).first;

  if (role === 'system') {
    return null;
  }

  const actionChips: ActionChipType[] = [];
  const messageParts: UIMessage['parts'] = [];

  for (const part of parts) {
    if (part.type === 'tool-actionChip') {
      if (part.state === 'output-available') {
        for (const chip of part.input.chips) {
          if (!actionChips.includes(chip)) {
            actionChips.push(chip);
          }
        }
      }
      continue;
    }

    messageParts.push(part);
  }

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
      <View style={tw`gap-1`}>
        {messageParts.map((part, i) => (
          <ChatMessagePart key={`${id}-${i}`} part={part} role={role} />
        ))}
        {actionChips.length > 0 && (
          <View style={tw`flex-row flex-wrap gap-1`}>
            {actionChips.map((type, i) => (
              <ChatActionChip key={i} type={type} />
            ))}
          </View>
        )}
      </View>
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

function ChatActionChip({
  type,
  ...props
}: Partial<ComponentProps<typeof Chip>> & { type: ActionChipType }) {
  const { handleContinue } = useQuizActions();
  const icon = {
    'end-interview': 'exit-run',
    'upload-documents': 'upload',
  }[type];

  return (
    <Chip
      icon={icon}
      onPress={() => {
        switch (type) {
          case 'end-interview': {
            handleContinue?.();
            break;
          }
          case 'upload-documents': {
            console.log('uploading documents');
            break;
          }
        }
      }}
      {...props}
    >
      <Trans i18nKey={`chat.chips.${type}`} />
    </Chip>
  );
}

function ChatMessagePart({
  part,
  role,
}: {
  part: UIMessage['parts'][number];
  role: string;
}) {
  switch (part.type) {
    case 'step-start': {
      return null;
    }
    case 'text': {
      return <ChatTextBubble role={role} text={part.text} />;
    }
  }

  console.warn('Unknown message part type:', part.type, { part, role });
}

function ChatTextBubble({ role, text }: { role: string; text: string }) {
  const theme = useTheme();

  return (
    <Surface
      elevation={0}
      style={tw.style(
        'max-w-4/5 rounded-3xl px-4 py-3',
        role === 'user' && 'self-end',
        role === 'user' && {
          backgroundColor: theme.colors.secondaryContainer,
        },
        role === 'assistant' && 'self-start',
        role === 'assistant' && {
          backgroundColor: theme.colors.primary,
        }
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
        {text}
      </Text>
    </Surface>
  );
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
