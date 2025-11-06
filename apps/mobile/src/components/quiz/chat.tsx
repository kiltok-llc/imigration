import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import z from 'zod/v4';

import {
  FormDocumentInput,
  FormDocumentSchema,
  FormDocumentsInput,
} from '@/components/form/document';
import { FormField } from '@/components/form/field';
import { useQuizPageHandle } from '@/components/quiz/page';
import { TransText } from '@/components/trans';
import { ChatMessage } from '@/components/ui/chat';
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
import { useQuizActions } from '@/lib/quiz/actions';
import {
  useQuizChatInputAtom,
  useQuizChatMessagesAtom,
  useQuizChatStateAtom,
  useQuizShowUploadDialogAtom,
} from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { getQuizPageAtomId, useQuizPageAtomKey } from '@/lib/quiz/page';
import { useT } from '@/lib/translation';
import { required } from '@/lib/utils';

const useBaseMessages = (prompt: string) => {
  const { t } = useTranslation();
  const i18nKey = useQuizPageLocaleKey('chat.messages');
  const assistantMessages = t(i18nKey, { returnObjects: true }) as UIMessage[];
  if (assistantMessages.some(({ metadata }) => !metadata?.transient)) {
    throw new Error(`Assistant messages should be transient: ${i18nKey}.`);
  }

  const systemMessage: UIMessage = {
    id: 'system-prompt',
    metadata: {
      transient: true,
    },
    parts: [
      {
        text: prompt,
        type: 'text',
      },
    ],
    role: 'system',
  };
  return [systemMessage, ...assistantMessages];
};

export function QuizChat({ prompt }: { prompt: string }) {
  const quizHeaderHeight = useAtomValue(quizHeaderHeightAtom);
  const navHeaderHeight = useHeaderHeight();

  const baseMessages = useBaseMessages(prompt);
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
    messages: [...baseMessages, ...persistedMessages],
    onFinish: ({ messages }) => {
      const newPersistedMessages = messages.filter(
        ({ metadata }) => !metadata?.transient
      );
      setPersistedMessages(newPersistedMessages);
    },
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
      <UploadDialog />
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
            void sendMessage({ text: text.trim() });
          }}
        />
      </KeyboardAvoidingView>
    </>
  );
}

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
  isThinking: _isThinking,
  messages,
}: PropsWithChildren<{ isThinking: boolean; messages: UIMessage[] }>) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      contentContainerStyle={tw`gap-2 p-2`}
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

function UploadDialog() {
  const [showUploadDialog, setShowUploadDialog] = useAtom(
    useQuizShowUploadDialogAtom()
  );

  const context = useForm({
    defaultValues: { asset: null },
    resolver: standardSchemaResolver(
      z.object({
        asset: required(FormDocumentSchema.nullable()),
      })
    ),
  });

  const { handleSubmit, reset } = context;

  return (
    <Dialog
      onDismiss={() => setShowUploadDialog(false)}
      visible={showUploadDialog}
    >
      <DialogContent>
        <TransText i18nKey='chat.dialog.upload.title' variant='titleLarge' />
        <View>
          <FormProvider {...context}>
            <FormField name='asset'>
              <FormDocumentInput />
            </FormField>
          </FormProvider>
        </View>
        <DialogActions>
          <DialogActionButton
            i18nKey='chat.dialog.upload.cancel'
            mode='contained-tonal'
            onPress={() => {
              reset();
              setShowUploadDialog(false);
            }}
          />
          <DialogActionButton
            i18nKey='chat.dialog.upload.confirm'
            onPress={handleSubmit(({ asset }) => {
              console.log(asset);
            })}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
