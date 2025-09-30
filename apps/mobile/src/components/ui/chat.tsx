import { useHeaderHeight } from '@react-navigation/elements';
import { useAtomValue } from 'jotai';
import { PropsWithChildren, ReactNode, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Surface, Text, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';

import { quizHeaderHeightAtom } from '@/lib/quiz/header';

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

export function ChatContainer({ children }: PropsWithChildren) {
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
      style={tw`flex-1`}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

export function ChatInput() {
  const [value, setValue] = useState('');
  return (
    <TextInput
      mode='outlined'
      onChangeText={setValue}
      outlineStyle={tw`rounded-3xl`}
      style={tw`m-2`}
      value={value}
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
