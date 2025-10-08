import { useHeaderHeight } from '@react-navigation/elements';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useRef } from 'react';
import { TextInput as RNTextInput, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import uuid from 'react-native-uuid';
import tw from 'twrnc';

import { QuizPage, QuizPageProps } from '@/components/quiz/page';
import { ChatBubble } from '@/components/ui/chat';
import { useCactus } from '@/lib/cactus';
import { nameAtom } from '@/lib/data/user';
import { quizChatInputAtom, quizChatMessagesAtom } from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageAtomKey, useQuizPageAtomKeyStatic } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';

export function QuizChatPage({
  pageId,
  pageKey = '',
  pageRef = null,
}: PropsWithChildren<QuizPageProps>) {
  const scrollRef = useRef<ScrollView>(null);
  const name = useAtomValue(nameAtom).first;

  const resetMessages = useResetAtom(
    quizChatMessagesAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const resetInput = useResetAtom(
    quizChatInputAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const messages = useAtomValue(
    quizChatMessagesAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

  const cactus = useCactus();

  return (
    <QuizPage
      onReset={() => {
        resetMessages();
        resetInput();
      }}
      onSubmit={async () => false}
      pageId={pageId}
      pageKey={pageKey}
      pageRef={pageRef}
    >
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
        style={tw`flex-1`}
      >
        <ScrollView contentContainerStyle={tw`p-2`} ref={scrollRef}>
          {messages.map(({ id, role, text }) => (
            <ChatBubble
              key={id}
              label={role === 'user' ? name : 'Migri'}
              side={role === 'user' ? 'right' : 'left'}
              text={text}
            />
          ))}
        </ScrollView>
        <QuizChatInput />
      </KeyboardAvoidingView>
    </QuizPage>
  );
}

function QuizChatInput() {
  const t = useT();
  const ref = useRef<RNTextInput>(null);
  const theme = useTheme();
  const [value, setValue] = useAtom(quizChatInputAtom(useQuizPageAtomKey()));
  const setMessages = useSetAtom(quizChatMessagesAtom(useQuizPageAtomKey()));

  const handleSend = () => {
    setMessages((messages) => [
      ...messages,
      { id: uuid.v4(), role: 'user', text: value.trim() },
    ]);
    setValue('');
  };

  return (
    <TextInput
      dense={true}
      mode='outlined'
      onChangeText={setValue}
      onSubmitEditing={handleSend}
      outlineStyle={tw`rounded-3xl`}
      placeholder={t('chat.placeholder')}
      ref={ref}
      right={
        <TextInput.Icon
          color={value ? theme.colors.primary : theme.colors.outline}
          icon={value ? 'arrow-up-circle' : 'microphone'}
          onPress={value ? handleSend : () => {}}
        />
      }
      style={tw`m-2`}
      value={value}
    />
  );
}
