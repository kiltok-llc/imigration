import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { CactusOAICompatibleMessage } from 'cactus-react-native';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ActivityIndicator, TextInput, useTheme } from 'react-native-paper';
import uuid from 'react-native-uuid';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { QuizPage, QuizPageProps } from '@/components/quiz/page';
import { ChatBubble } from '@/components/ui/chat';
import {
  HeaderMenuItem,
  HeaderMenuItemPortal,
} from '@/components/ui/header-menu';
import { useCactus } from '@/lib/cactus';
import { nameAtom } from '@/lib/data/user';
import { quizChatInputAtom, quizChatMessagesAtom } from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { useQuizPageAtomKey, useQuizPageAtomKeyStatic } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';

export const useBaseMessages = () => {
  const { t } = useTranslation();
  const i18nKey = useQuizPageLocaleKey('chat.messages');
  return t(i18nKey, { returnObjects: true }) as CactusOAICompatibleMessage[];
};

export function QuizChatPage({
  pageId,
  pageKey = '',
  pageRef = null,
  prompt = '',
}: PropsWithChildren<QuizPageProps> & {
  prompt?: string; // TODO make this required
}) {
  const t = useT();

  const resetMessages = useResetAtom(
    quizChatMessagesAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const resetInput = useResetAtom(
    quizChatInputAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );

  const { cactus, status } = useCactus();

  const [messages, setMessages] = useAtom(
    quizChatMessagesAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );
  const inputValue = useAtomValue(
    quizChatInputAtom(useQuizPageAtomKeyStatic({ pageId, pageKey }))
  );

  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

  const { isPending: isThinking, mutate: handleSendInput } = useMutation({
    meta: {
      errorToastKey: 'chat.toast.chat-error',
    },
    mutationFn: async () => {
      if (status !== 'initialized') {
        toast.warning(t('chat.toast.not-ready'));
        return;
      }

      const message = inputValue.trim();
      setMessages((messages) => [
        ...messages,
        { id: uuid.v4(), role: 'user', text: message },
      ]);
      resetInput();

      const response = await cactus.generateResponse([
        { content: prompt, role: 'system' },
        ...messages.map(({ role, text }) => ({
          content: text,
          role,
        })),
        { content: message, role: 'user' },
      ]);

      setMessages((messages) => [
        ...messages,
        { id: uuid.v4(), role: 'assistant', text: response },
      ]);
    },
  });

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
      <HeaderMenuItemPortal>
        <HeaderMenuItem
          i18nKey='chat.menu.reset'
          leadingIcon='refresh'
          onPress={() => {
            resetMessages();
            resetInput();
          }}
        />
      </HeaderMenuItemPortal>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
        style={tw`flex-1`}
      >
        <QuizChatMessages isThinking={isThinking} />
        <QuizChatInput onSendInput={handleSendInput} />
      </KeyboardAvoidingView>
    </QuizPage>
  );
}

function QuizChatInput({ onSendInput }: { onSendInput: () => void }) {
  const t = useT();
  const ref = useRef<RNTextInput>(null);
  const theme = useTheme();
  const [value, setValue] = useAtom(quizChatInputAtom(useQuizPageAtomKey()));

  return (
    <TextInput
      dense={true}
      mode='outlined'
      multiline={true}
      onChangeText={setValue}
      onSubmitEditing={onSendInput}
      outlineStyle={tw`rounded-3xl`}
      placeholder={t('chat.placeholder')}
      ref={ref}
      right={
        <TextInput.Icon
          color={value ? theme.colors.primary : theme.colors.outline}
          icon={value ? 'arrow-up-circle' : 'microphone'}
          onPress={value ? onSendInput : () => {}}
        />
      }
      style={tw.style(`m-2`, { backgroundColor: theme.colors.surface })}
      value={value}
    />
  );
}

function QuizChatMessages({ isThinking }: { isThinking: boolean }) {
  const name = useAtomValue(nameAtom).first;
  const baseMessages = useBaseMessages();
  const messages = useAtomValue(quizChatMessagesAtom(useQuizPageAtomKey()));
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [messages]);

  return (
    <ScrollView contentContainerStyle={tw`p-2`} ref={scrollRef}>
      {baseMessages.map(({ content, role }, idx) => (
        <ChatBubble
          key={`base-${idx}`}
          label={role === 'user' ? name : 'Migri'}
          side={role === 'user' ? 'right' : 'left'}
          text={Array.isArray(content) ? content.join('\n') : content}
        />
      ))}
      {messages.map(({ id, role, text }) => (
        <ChatBubble
          key={id}
          label={role === 'user' ? name : 'Migri'}
          side={role === 'user' ? 'right' : 'left'}
          text={text}
        />
      ))}
      {isThinking && (
        <ChatBubble
          label='Migri'
          side='left'
          text={<ActivityIndicator size='small' style={tw`p-1`} />}
        />
      )}
    </ScrollView>
  );
}
