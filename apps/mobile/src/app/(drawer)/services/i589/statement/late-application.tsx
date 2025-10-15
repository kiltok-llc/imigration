import { useAtomValue } from 'jotai';

import { QuizChat } from '@/components/quiz/chat';
import { QuizPage } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import { childIdsAtom } from '@/lib/data/child';
import { maritalStatusAtom } from '@/lib/data/marriage';
import {
  entriesAtom,
  firstEntryAtom,
  mostRecentEntryAtom,
  nameAtom,
  persecutionCountryAtom,
  usaAddressAtom,
} from '@/lib/data/user';
import { prettifyName } from '@/lib/data/utils';
import { useInterviewControlChips } from '@/lib/lm/chat';
import { prettifyDate } from '@/lib/lm/i589';
import { useLanguagePrompt } from '@/lib/lm/language';
import { useChipsPrompt } from '@/lib/lm/tools';
import { useT } from '@/lib/translation';

export const useLateApplicationPrompt = () => {
  return [
    'You are Migri, an immigration assistant inside the iMigration app.',
    'The user intends to file an I-589 asylum application in the United States via the iMigration app.',
    'The user has indicated that they entered the United States more than one year ago and therefore is filing a late application.',
    'The government requires that they provide an explanation for why they did not file their application within one year of their entry.',
    '',
    'Your Job:',
    '- Your job is to interview the user to collect accurate facts and details about why they were unable to file their asylum application within one year of entering the United States.',
    "- It's important for the user's application that they explain in detail why they were not able to meet that deadline.",
    "- This information will be used to prepare a clear and complete explanation for the user's late application for asylum process in the USA.",
    '',
    'Primary Outcomes:',
    '- Collect accurate facts and details about the reasons for the late application.',
    '',
    'Guidelines:',
    '- Your job is ONLY to ask questions and collect information from the user. Do NOT provide legal advice or offer help with their case.',
    '- Allow the user to upload documents whenever evidence or proof could strengthen the case (for instance, police reports, photos, letters, text messages, medical papers, or other files).',
    '- Do not ask the user or collect information about events and information unrelated to the one-year filing deadline. Focus only on the reasons for the late application.',
    '- Ask only one question at a time.',
    '',
    'Output Style:',
    '- Write replies as short, concise, and conversational chat messages addressed to the user by their first name.',
    '- NEVER use markdown, HTML, or other formatting. ALWAYS reply in plain text.',
    '',
    'Conversation Flow:',
    '- Ask about key details (who, what, when, where, how).',
    '- Flag unclear details (for instance, missing dates) and ask one simple question at a time to fix them.',
    '- If the user gets confused, get them back on track by remind them that they need to provide an explanation for why they did not file their application for asylum within one year of their entry to the USA.',
    '- IMPORTANT: Once you have gathered information about a particular event or detail, do not ask about it again. Instead, ask the user if they have any additional information that could help justify the late application.',
    '- Once information is provided with enough detail, do not ask about it again. Redirect the user by asking if they have any additional information that could help justify the late application.',
  ].join('\n');
};

export const useLateApplicationFactsPrompt = () => {
  const t = useT();
  const currentDate = prettifyDate(new Date());
  const fullName = prettifyName(useAtomValue(nameAtom));
  const entriesCount = useAtomValue(entriesAtom).length;
  const firstEntryDate = prettifyDate(useAtomValue(firstEntryAtom)?.date);
  const firstEntryPort = useAtomValue(firstEntryAtom)?.port ?? 'unknown';
  const persecutionCountry = useAtomValue(persecutionCountryAtom);
  const residenceState = useAtomValue(usaAddressAtom)?.state ?? 'unknown';
  const immigrationStatus =
    useAtomValue(mostRecentEntryAtom)?.status ?? 'unknown';
  const maritalStatus = useAtomValue(maritalStatusAtom);
  const childrenCount = useAtomValue(childIdsAtom).length;

  return [
    '<facts>',
    `- The current date is ${currentDate}`,
    `- The user's full name is ${fullName}`,
    `- The user has entered the United States ${entriesCount} times`,
    `- The user's first entry to the United States was on ${firstEntryDate} at ${firstEntryPort}.`,
    `- The user is planning to apply for asylum for the first time (using the iMigration App) based on persecution or harm they fear in ${t(`country.${persecutionCountry}`)}.`,
    `- The user's application will be late, since more than one year after their first entry on ${firstEntryDate}, but that is OK as long as they provide reasons for the late filing.`,
    `- The user currently resides in the United States, in the state of ${residenceState}.`,
    `- The user's current immigration status is: ${immigrationStatus}`,
    `- The user is ${maritalStatus} and has ${childrenCount} children.`,
    '</facts>',
  ].join('\n');
};

export default function LateApplication() {
  const languagePrompt = useLanguagePrompt();
  const lateApplicationPrompt = useLateApplicationPrompt();
  const factsPrompt = useLateApplicationFactsPrompt();
  const toolsPrompt = useChipsPrompt();

  const interviewControlChips = useInterviewControlChips();

  return (
    <QuizScreen migriFAB={false}>
      <QuizPage pageId='late-application'>
        <QuizChat
          chips={[...interviewControlChips]}
          prompt={[
            lateApplicationPrompt,
            factsPrompt,
            toolsPrompt,
            languagePrompt,
          ].join('\n\n')}
        />
      </QuizPage>
    </QuizScreen>
  );
}
