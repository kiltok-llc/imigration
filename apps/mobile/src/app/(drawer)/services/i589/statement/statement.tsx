import { useAtomValue } from 'jotai';

import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import {
  ChatBubble,
  ChatContainer,
  ChatInput,
  ChatMessages,
} from '@/components/ui/chat';
import { nameAtom } from '@/lib/data/user';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type ChatRole = 'assistant' | 'user';

const chatMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: "Hi, I'm Migri. I'll guide you through the details we need for your personal statement.",
  },
  {
    id: 'user-start',
    role: 'user',
    text: "Thanks, I'm ready to share my story.",
  },
  {
    id: 'follow-up',
    role: 'assistant',
    text: 'Great. Could you start with the main reason you left your home country?',
  },
  {
    id: 'user-details',
    role: 'user',
    text: 'In 2021 I received repeated threats from local officials because of my activism. I felt unsafe staying there.',
  },
  {
    id: 'evidence',
    role: 'assistant',
    text: 'Thank you for sharing that. Do you have any documents, photos, or messages that support what happened?',
  },
  {
    id: 'user-evidence',
    role: 'user',
    text: 'Yes. I have scanned copies of the police reports and the messages that were sent to me.',
  },
  {
    id: 'summary',
    role: 'assistant',
    text: "Perfect. I'll help you organize these details so they read clearly in your statement.",
  },
];

export default function Statement() {
  const name = useAtomValue(nameAtom).first;
  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='statement'>
        <ChatContainer>
          <ChatMessages>
            {chatMessages.map(({ id, role, text }) => (
              <ChatBubble
                key={id}
                label={role === 'assistant' ? 'Migri' : name}
                side={role === 'assistant' ? 'left' : 'right'}
                text={text}
              />
            ))}
          </ChatMessages>
          <ChatInput />
        </ChatContainer>
      </QuizPage>
    </QuizScreen>
  );
}
