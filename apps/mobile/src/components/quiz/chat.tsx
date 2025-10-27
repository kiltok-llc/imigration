import { useHeaderHeight } from '@react-navigation/elements';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import { Markdown } from 'react-native-remark';
import tw from 'twrnc';

import { useQuizPageHandle } from '@/components/quiz/page';
import { TransText } from '@/components/trans';
import { ChatMessage, ChatThinkingDots } from '@/components/ui/chat';
import {
  Dialog,
  DialogActionButton,
  DialogActions,
  DialogContent,
} from '@/components/ui/dialog';
import {
  HeaderMenuItem,
  HeaderMenuItemPortal,
} from '@/components/ui/header-menu';
import { UIMessage } from '@/lib/chat/schema';
import { useChat } from '@/lib/chat/use-chat';
import { nameAtom } from '@/lib/data/user';
import { useQuizActions } from '@/lib/quiz/actions';
import {
  QuizChatActionChip,
  useQuizChatChipsAtom,
  useQuizChatInputAtom,
  useQuizChatMessagesAtom,
  useQuizChatStateAtom,
} from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { getQuizPageAtomId, useQuizPageAtomKey } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';

const useBaseMessages = () => {
  const { t } = useTranslation();
  const i18nKey = useQuizPageLocaleKey('chat.messages');
  // TODO need to parse arrays to multiline strings
  return t(i18nKey, { returnObjects: true }) as UIMessage[];
};

export function QuizChat({
  chips: _chips,
  prompt: _prompt,
}: {
  chips: QuizChatActionChip[];
  prompt: string;
}) {
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

  const baseMessages = useBaseMessages();
  const [persistedMessages, setPersistedMessages] = useAtom(
    useQuizChatMessagesAtom()
  );
  const setInput = useSetAtom(useQuizChatInputAtom());
  const [state, setState] = useAtom(useQuizChatStateAtom());
  const resetState = useResetAtom(useQuizChatStateAtom());
  const [showEndInterviewDialog, setShowEndInterviewDialog] = useState(false);
  const { handleContinue } = useQuizActions();

  const chatId = getQuizPageAtomId(useQuizPageAtomKey(), 'chat');
  const { messages, sendMessage, setMessages, status } = useChat({
    id: chatId,
    // messages: [...baseMessages, ...persistedMessages],
    messages: persistedMessages,
    onData: (data) => console.log('data', data),
    onFinish: () => console.log('finished'),
  });

  const handleReset = () => {
    void setPersistedMessages([]);
    setMessages(baseMessages);
    setInput('');
    resetState();
  };

  useQuizPageHandle(() => ({
    reset: handleReset,
    submit: async () => {
      if (state === 'completed') {
        return true;
      }

      setShowEndInterviewDialog(true);
      return false;
    },
  }));

  return (
    <>
      <HeaderMenuItemPortal>
        <HeaderMenuItem
          i18nKey='chat.menu.reset'
          leadingIcon='refresh'
          onPress={handleReset}
        />
      </HeaderMenuItemPortal>
      <Dialog
        onDismiss={() => setShowEndInterviewDialog(false)}
        visible={showEndInterviewDialog}
      >
        <DialogContent>
          <TransText i18nKey='chat.dialog.end.title' variant='titleLarge' />
          <View>
            <TransText
              i18nKey='chat.dialog.end.subtitle'
              variant='titleMedium'
            />
            <TransText
              i18nKey='chat.dialog.end.description'
              variant='bodyLarge'
            />
          </View>
          <DialogActions>
            <DialogActionButton
              i18nKey='chat.dialog.end.cancel'
              mode='contained-tonal'
              onPress={() => setShowEndInterviewDialog(false)}
            />
            <DialogActionButton
              i18nKey='chat.dialog.end.confirm'
              onPress={() => {
                setState('completed');
                setShowEndInterviewDialog(false);
                handleContinue?.();
              }}
            />
          </DialogActions>
        </DialogContent>
      </Dialog>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={quizHeaderHeight + navHeaderHeight}
        style={tw`flex-1`}
      >
        <QuizChatMessages
          isThinking={status === 'submitted'}
          messages={messages}
        />
        <QuizChatInput
          onSubmit={(text) => {
            setInput('');
            void sendMessage({ text });
          }}
        />
      </KeyboardAvoidingView>
    </>
  );
}

// function QuizChatChips({
//   availableChips,
// }: {
//   availableChips: QuizChatActionChip[];
// }) {
//   const chipIds = useAtomValue(useQuizChatChipsAtom());
//
//   if (chipIds.length === 0) {
//     return null;
//   }
//
//   return (
//     <View style={tw`mt-2 flex-row flex-wrap gap-2`}>
//       {availableChips
//         .filter(({ id }) => chipIds.includes(id))
//         .map(({ id, render }) => (
//           <View key={id}>{render()}</View>
//         ))}
//     </View>
//   );
// }

function QuizChatInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const t = useT();
  const ref = useRef<RNTextInput>(null);
  const theme = useTheme();
  const [value, setValue] = useAtom(useQuizChatInputAtom());

  return (
    <TextInput
      dense={true}
      mode='outlined'
      multiline={true}
      onChangeText={setValue}
      onSubmitEditing={(e) => onSubmit(e.nativeEvent.text)}
      outlineStyle={tw`rounded-3xl`}
      placeholder={t('chat.placeholder')}
      ref={ref}
      right={
        <TextInput.Icon
          color={value ? theme.colors.primary : theme.colors.outline}
          icon={value ? 'arrow-up-circle' : 'microphone'}
          onPress={value ? () => onSubmit(value) : () => {}}
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
  messages,
}: PropsWithChildren<{ isThinking: boolean; messages: UIMessage[] }>) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      contentContainerStyle={tw`p-2`}
      onContentSizeChange={() => {
        scrollRef.current?.scrollToEnd();
      }}
      ref={scrollRef}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {children}
    </ScrollView>
  );
}
