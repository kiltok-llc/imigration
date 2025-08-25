import { Portal } from 'react-native-paper';

import { MigriModal } from '@/components/migri/migri-modal';

export function MigriPortal() {
  return (
    <Portal>
      <MigriModal />
    </Portal>
  );
}
