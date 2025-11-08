import { useChat } from '@ai-sdk/react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useHeaderHeight } from '@react-navigation/elements';
import { useMutation } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { Directory, File, Paths } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  FAB,
  IconButton,
  Menu,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import uuid from 'react-native-uuid';
import tw from 'twrnc';
import z from 'zod/v4';

import {
  FormDocument,
  FormDocumentInput,
  FormDocumentSchema,
  FormMultiDocumentInput,
  PickDocumentType,
  usePickMutation,
} from '@/components/form/document';
import { FormField, useFormField } from '@/components/form/field';
import { useQuizPageHandle } from '@/components/quiz/page';
import { TransText } from '@/components/trans';
import { ChatMessage } from '@/components/ui/chat';
import {
  Dialog,
  DialogActionButton,
  DialogActions,
  DialogContent,
} from '@/components/ui/dialog';
import { SingleDocumentInput } from '@/components/ui/document';
import {
  HeaderMenuItem,
  HeaderMenuItemPortal,
} from '@/components/ui/header-menu';
import { env } from '@/env';
import { sessionAtom } from '@/lib/auth';
import { UIMessage } from '@/lib/chat/schema';
import { useQuizActions } from '@/lib/quiz/actions';
import {
  quizShowUploadDialogAtom,
  useQuizChatInputAtom,
  useQuizChatMessagesAtom,
  useQuizChatStateAtom,
  useQuizShowUploadDialogAtom,
} from '@/lib/quiz/chat';
import { quizHeaderHeightAtom } from '@/lib/quiz/header';
import { useQuizPageLocaleKey } from '@/lib/quiz/locale';
import { getQuizPageAtomId, useQuizPageAtomKey } from '@/lib/quiz/page';
import { supabase } from '@/lib/supabase/client';
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

const defaultStore = getDefaultStore();

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
  const setShowUploadDialog = useSetAtom(useQuizShowUploadDialogAtom());

  // Workaround for https://github.com/vercel/ai/issues/7819
  const headersRef = useRef<Record<string, string>>({});
  const session = useAtomValue(sessionAtom);
  headersRef.current = {
    Authorization: `Bearer ${session?.access_token}`,
  };

  const { messages, sendMessage, setMessages, status } = useChat({
    id: chatId,
    messages: [...baseMessages, ...persistedMessages],
    onError: (error) => console.error(error),
    onFinish: ({ messages }) => {
      const newPersistedMessages = messages.filter(
        ({ metadata }) => !metadata?.transient
      );
      setPersistedMessages(newPersistedMessages);
    },
    transport: new DefaultChatTransport({
      api: `${env.EXPO_PUBLIC_API_BASE_URL}/api/chat`,
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      headers: () => headersRef.current,
    }),
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
        <HeaderMenuItem
          i18nKey='chat.menu.submit'
          leadingIcon='upload'
          onPress={() => setShowUploadDialog(true)}
        />
      </HeaderMenuItemPortal>
      <SubmitDocumentDialog
        onSubmit={({ name, remoteUrl, type, uri }) => {
          void sendMessage({
            files: [
              {
                filename: name,
                mediaType: type,
                providerMetadata: {
                  local: {
                    localUri: uri,
                  },
                },
                type: 'file',
                url: remoteUrl,
              },
            ],
          });
        }}
      />
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
  const [open, setOpen] = useState(false);

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
          onPress={value ? () => onSubmit(value) : () => setOpen(true)}
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
      {messages.map((message, i) => (
        <ChatMessage key={`${message.id}-${i}`} message={message} />
      ))}
      {children}
    </ScrollView>
  );
}

const ChatDocumentSchema = FormDocumentSchema.extend({
  remoteUrl: z.string(),
});
export type ChatDocument = z.infer<typeof ChatDocumentSchema>;

function SubmitDocumentDialog({
  onSubmit,
}: {
  onSubmit: (doc: ChatDocument) => void;
}) {
  const [showUploadDialog, setShowUploadDialog] = useAtom(
    useQuizShowUploadDialogAtom()
  );

  const context = useForm({
    defaultValues: { document: null },
    resolver: standardSchemaResolver(
      z.object({
        document: required(ChatDocumentSchema.nullable()),
      })
    ),
  });

  const { handleSubmit, reset } = context;

  return (
    <Dialog
      onDismiss={() => {
        reset();
        setShowUploadDialog(false);
      }}
      visible={showUploadDialog}
    >
      <DialogContent>
        <TransText i18nKey='chat.dialog.upload.title' variant='titleLarge' />
        <View>
          <FormProvider {...context}>
            <FormField name='document'>
              <SubmitDocumentInput />
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
            onPress={handleSubmit(({ document }) => {
              onSubmit(document);
              reset();
              setShowUploadDialog(false);
            })}
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

function SubmitDocumentInput() {
  const session = useAtomValue(sessionAtom);
  const {
    field: { disabled, onChange, value },
    fieldState: { invalid },
  } = useFormField();

  const { mutateAsync: pickDocument } = usePickMutation();
  const { isPending, mutate: handlePickAndUpload } = useMutation({
    meta: {
      errorToastKey: 'chat.toast.file-error',
    },
    mutationFn: async (type: PickDocumentType) => {
      const [document] = await pickDocument({ type });
      if (!document) {
        return;
      }

      const { name, type: contentType, uri } = document;
      const file = new File(uri);
      const localDir = new Directory(Paths.document, uuid.v4());
      localDir.create();
      file.move(localDir);

      const path = `${session!.user.id}/${uuid.v4()}-${name.replaceAll('/', '_')}`;
      const { data, error } = await supabase.storage
        .from('chat_content')
        .upload(path, await file.bytes(), { contentType });

      if (error) {
        throw error;
      }

      // authenticated URL, we will pass our auth header to chat api so it can be accessed
      const { fullPath } = data;
      const remoteUrl = `${env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/${fullPath}`;

      onChange({
        ...document,
        remoteUrl,
        uri: file.uri,
      });
    },
  });

  return (
    <SingleDocumentInput
      disabled={disabled}
      handlePickCamera={() => handlePickAndUpload('camera')}
      handlePickDocument={() => handlePickAndUpload('document')}
      handlePickImage={() => handlePickAndUpload('library')}
      invalid={invalid}
      isPending={isPending}
      onChange={onChange}
      value={value}
    />
  );
}
