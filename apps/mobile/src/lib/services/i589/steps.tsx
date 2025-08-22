import { Entypo, FontAwesome } from '@expo/vector-icons';

import { Step } from '@/lib/services/types';

export const STEPS: Step[] = [
  {
    Icon: (props) => <Entypo name='help' {...props} />,
    id: 'eligibility',
  },
  {
    Icon: (props) => <Entypo name='info' {...props} />,
    id: 'info',
  },
  {
    Icon: (props) => <Entypo name='modern-mic' {...props} />,
    id: 'statement',
  },
  {
    Icon: (props) => <Entypo name='eye' {...props} />,
    id: 'review',
  },
  {
    Icon: (props) => <Entypo name='clock' {...props} />,
    id: 'waiting',
  },
  {
    Icon: (props) => <Entypo name='users' {...props} />,
    id: 'interview',
  },
  {
    Icon: (props) => <FontAwesome name='gavel' {...props} />,
    id: 'decision',
  },
  {
    Icon: (props) => <Entypo name='documents' {...props} />,
    id: 'appeal',
  },
];
