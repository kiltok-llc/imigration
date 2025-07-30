import { Entypo, FontAwesome } from '@expo/vector-icons';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { mmkvStorage } from '@/lib/mmkv';
import { StepIcon } from '@/lib/services/types';

type Step = {
  Icon: StepIcon;
  id: string;
}

export const stepIdAtom = atomWithStorage(
  'services.i589.step',
  'eligibility',
  createJSONStorage(() => mmkvStorage),
  { getOnInit: true },
);

export const stepsAtom = atom<Step[]>([
  {
    Icon: (props) => <Entypo name="help" {...props} />,
    id: 'eligibility',
  },
  {
    Icon: (props) => <Entypo name="info" {...props} />,
    id: 'personalInfo',
  },
  {
    Icon: (props) => <Entypo name="attachment" {...props} />,
    id: 'documents',
  },
  {
    Icon: (props) => <Entypo name="eye" {...props} />,
    id: 'review',
  },
  {
    Icon: (props) => <Entypo name="clock" {...props} />,
    id: 'waiting',
  },
  {
    Icon: (props) => <Entypo name="users" {...props} />,
    id: 'interview',
  },
  {
    Icon: (props) => <FontAwesome name="gavel" {...props} />,
    id: 'decision',
  },
  {
    Icon: (props) => <Entypo name="documents" {...props} />,
    id: 'appeal',
  },
]);

export const stepAtom = atom((get) => {
  const stepId = get(stepIdAtom);
  const steps = get(stepsAtom);
  return steps.find((step) => step.id === stepId);
});

export const incrementStepAtom = atom(null, (get, set, update: number = 1) => {
  const stepId = get(stepIdAtom);
  const steps = get(stepsAtom);
  const stepIdx = steps.findIndex((step) => step.id === stepId);

  set(stepIdAtom, steps[(stepIdx + update) % steps.length]!.id);
});