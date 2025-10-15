import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { CactusOAICompatibleMessage } from 'cactus-react-native';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PropsWithChildren, ReactNode, Ref, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import { Markdown } from 'react-native-remark';
import uuid from 'react-native-uuid';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { QuizPageProps, useQuizPageHandle } from '@/components/quiz/page';
import { ChatBubble, ChatThinkingDots } from '@/components/ui/chat';
import {
  HeaderMenuItem,
  HeaderMenuItemPortal,
} from '@/components/ui/header-menu';
import { CactusActionChip, useCactus } from '@/lib/cactus';
import { nameAtom } from '@/lib/data/user';
import {
  QuizChatActionChip,
  quizChatChipsAtom,
  quizChatInputAtom,
  quizChatMessagesAtom,
} from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { useQuizPageAtomKey } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';

const useBaseMessages = () => {
  const { t } = useTranslation();
  const i18nKey = useQuizPageLocaleKey('chat.messages');
  return t(i18nKey, { returnObjects: true }) as CactusOAICompatibleMessage[];
};

export function QuizChat({
  chips: availableChips,
  prompt,
}: {
  chips: QuizChatActionChip[];
  prompt: string;
}) {
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

  const t = useT();
  const { cactus, status } = useCactus();
  const [messages, setMessages] = useAtom(
    quizChatMessagesAtom(useQuizPageAtomKey())
  );
  const [input, setInput] = useAtom(quizChatInputAtom(useQuizPageAtomKey()));
  const setChips = useSetAtom(quizChatChipsAtom(useQuizPageAtomKey()));

  const { isPending: isThinking, mutate: handleSendInput } = useMutation({
    meta: {
      errorToastKey: 'chat.toast.chat-error',
    },
    mutationFn: async () => {
      if (status !== 'initialized') {
        toast.warning(t('chat.toast.not-ready'));
        console.log(`Cactus not ready: ${status}`);
        return;
      }

      const message = input.trim();
      setMessages((messages) => [
        ...messages,
        { id: uuid.v4(), role: 'user', text: message },
      ]);
      setInput('');
      setChips([]);

      const response = await cactus.generateResponse(
        [
          { content: prompt, role: 'system' },
          ...messages.map(({ role, text }) => ({
            content: text,
            role,
          })),
          { content: message, role: 'user' },
        ],
        availableChips,
        (chip) => setChips((chips) => [...chips, chip])
      );

      // TODO -- what if state is reset while we are generating?
      setMessages((messages) => [
        ...messages,
        {
          id: uuid.v4(),
          role: 'assistant',
          text: response,
        },
      ]);
    },
  });

  useQuizPageHandle(() => ({
    reset: () => {
      setMessages([]);
      setInput('');
    },
    submit: async () => false,
  }));

  return (
    <>
      <HeaderMenuItemPortal>
        <HeaderMenuItem
          i18nKey='chat.menu.reset'
          leadingIcon='refresh'
          onPress={() => {
            setMessages([]);
            setInput('');
            setChips([]);
          }}
        />
      </HeaderMenuItemPortal>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
        style={tw`flex-1`}
      >
        <QuizChatMessages isThinking={isThinking}>
          <QuizChatChips />
        </QuizChatMessages>
        <QuizChatInput onSendInput={handleSendInput} />
      </KeyboardAvoidingView>
    </>
  );
}

function QuizChatChips() {
  const chips = useAtomValue(quizChatChipsAtom(useQuizPageAtomKey()));
  console.log('chips', chips);
  // TODO
  return null;
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

function QuizChatMessages({
  children,
  isThinking,
}: PropsWithChildren<{ isThinking: boolean }>) {
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
        >
          {Array.isArray(content) ? content.join('\n') : content}
        </ChatBubble>
      ))}
      {messages.map(({ id, role, text }) => (
        <ChatBubble
          key={id}
          label={role === 'user' ? name : 'Migri'}
          side={role === 'user' ? 'right' : 'left'}
        >
          {role === 'user' ? text : <Markdown markdown={text} />}
        </ChatBubble>
      ))}
      {isThinking && (
        <ChatBubble label='Migri' side='left'>
          <ChatThinkingDots />
        </ChatBubble>
      )}
      {children}
    </ScrollView>
  );
}
