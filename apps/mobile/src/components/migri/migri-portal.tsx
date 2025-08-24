import { Portal } from 'react-native-paper';

import { MigriModal } from '@/components/migri/migri-modal';

export function MigriPortal({ ready = true }: { ready?: boolean }) {
  return (
    <Portal>
      <MigriModal ready={ready} />
    </Portal>
  );
}
