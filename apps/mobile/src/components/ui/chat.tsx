import { useHeaderHeight } from '@react-navigation/elements';
import { useAtomValue } from 'jotai';
import { ComponentProps, PropsWithChildren, ReactNode, useRef } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Surface, Text, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useT } from '@/lib/translation';

export type Side = 'left' | 'right';

export function ChatBubble({
  label,
  side,
  text,
}: {
  label: ReactNode;
  side: Side;
  text: string;
}) {
  const theme = useTheme();

  return (
    <View style={tw`gap-1`}>
      <Text
        style={tw.style(side === 'left' ? 'self-start' : 'self-end', {
          color: theme.colors.onSurfaceVariant,
        })}
        variant='labelSmall'
      >
        {label}
      </Text>
      <Surface
        elevation={0}
        style={tw.style(
          'max-w-4/5 rounded-3xl px-4 py-3',
          side === 'left' ? 'self-start' : 'self-end',
          {
            backgroundColor:
              side === 'left'
                ? theme.colors.secondaryContainer
                : theme.colors.primary,
          }
        )}
      >
        <Text
          style={tw.style({
            color:
              side === 'left'
                ? theme.colors.onSecondaryContainer
                : theme.colors.onPrimary,
          })}
          variant='bodyLarge'
        >
          {text}
        </Text>
      </Surface>
    </View>
  );
}

export function ChatContainer({
  children,
  style,
}: PropsWithChildren<{ style?: ViewStyle }>) {
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
      style={style}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

export function ChatInput({
  outlineStyle,
  style,
  ...props
}: ComponentProps<typeof TextInput>) {
  const t = useT();

  return (
    <TextInput
      dense={true}
      mode='outlined'
      outlineStyle={[tw`rounded-3xl`, outlineStyle]}
      placeholder={t('chat.placeholder')}
      right={<TextInput.Icon icon='microphone' />}
      style={[tw`m-2`, style]}
      {...props}
    />
  );
}

export function ChatMessages({ children }: PropsWithChildren) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView contentContainerStyle={tw`p-2`} ref={scrollRef}>
      {children}
    </ScrollView>
  );
}
