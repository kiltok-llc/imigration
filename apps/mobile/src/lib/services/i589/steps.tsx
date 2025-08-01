import { Entypo, FontAwesome } from '@expo/vector-icons';
import { atom } from 'jotai';
import z from 'zod/v4';

import { atomWithMmkvStorage } from '@/atom/atom-with-mmkv-storage';
import { StepIcon } from '@/lib/services/types';

export const StepIdEnum = z.enum([
  'eligibility',
  'personal-info',
  'documents',
  'review',
  'waiting',
  'interview',
  'decision',
  'appeal',
]);

export type StepId = z.infer<typeof StepIdEnum>;

type Step = {
  Icon: StepIcon;
  id: StepId;
}

export const stepIdAtom = atomWithMmkvStorage(
  'services.i589.stepId',
  'eligibility',
  StepIdEnum,
);

export const stepsAtom = atom<Step[]>([
  {
    Icon: (props) => <Entypo name="help" {...props} />,
    id: 'eligibility',
  },
  {
    Icon: (props) => <Entypo name="info" {...props} />,
    id: 'personal-info',
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