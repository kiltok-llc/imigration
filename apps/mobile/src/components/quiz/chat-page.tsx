import { useHeaderHeight } from '@react-navigation/elements';
import { CactusOAICompatibleMessage } from 'cactus-react-native';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import uuid from 'react-native-uuid';
import tw from 'twrnc';

import { QuizPage, QuizPageProps } from '@/components/quiz/page';
import { ChatBubble } from '@/components/ui/chat';
import { cactus, useLoadCactus } from '@/lib/cactus';
import { nameAtom } from '@/lib/data/user';
import { quizChatInputAtom, quizChatMessagesAtom } from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { useQuizPageAtomKey, useQuizPageAtomKeyStatic } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';

export const useBaseMessages = () => {
  const { t } = useTranslation();
  const name = useAtomValue(nameAtom);
  const i18nKey = useQuizPageLocaleKey('chat.messages');
  return [
    ...(t('chat.messages', {
      name,
      returnObjects: true,
    }) as CactusOAICompatibleMessage[]),
    ...(t(i18nKey, { returnObjects: true }) as CactusOAICompatibleMessage[]),
  ];
};

export function QuizChatPage({
  pageId,
  pageKey = '',
  pageRef = null,
}: PropsWithChildren<QuizPageProps>) {
  useLoadCactus();

  const scrollRef = useRef<ScrollView>(null);

  const resetMessages = useResetAtom(
    quizChatMessagesAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const resetInput = useResetAtom(
    quizChatInputAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

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
          <QuizChatMessages />
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
  const baseMessages = useBaseMessages();
  const [value, setValue] = useAtom(quizChatInputAtom(useQuizPageAtomKey()));
  const [messages, setMessages] = useAtom(
    quizChatMessagesAtom(useQuizPageAtomKey())
  );

  const handleSend = async () => {
    setMessages((messages) => [
      ...messages,
      { id: uuid.v4(), role: 'user', text: value.trim() },
    ]);
    setValue('');

    const prompt = [
      ...baseMessages.map(({ content, ...rest }) => ({
        content: Array.isArray(content) ? content.join('\n') : content,
        ...rest,
      })),
      ...messages.map(({ role, text }) => ({
        content: text,
        role,
      })),
      { content: value.trim(), role: 'user' },
    ];
    console.log('prompt', prompt);
    const assistantMessage = await cactus.generateResponse(prompt);

    console.log('generated!');
    setMessages((messages) => [
      ...messages,
      { id: uuid.v4(), role: 'assistant', text: assistantMessage },
    ]);
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

function QuizChatMessages() {
  const name = useAtomValue(nameAtom).first;
  const baseMessages = useBaseMessages();
  const messages = useAtomValue(quizChatMessagesAtom(useQuizPageAtomKey()));

  return (
    <>
      {baseMessages.map(
        ({ content, role }, idx) =>
          role !== 'system' && (
            <ChatBubble
              key={`base-${idx}`}
              label={role === 'user' ? name : 'Migri'}
              side={role === 'user' ? 'right' : 'left'}
              text={Array.isArray(content) ? content.join('\n') : content}
            />
          )
      )}
      {messages.map(({ id, role, text }) => (
        <ChatBubble
          key={id}
          label={role === 'user' ? name : 'Migri'}
          side={role === 'user' ? 'right' : 'left'}
          text={text}
        />
      ))}
    </>
  );
}
