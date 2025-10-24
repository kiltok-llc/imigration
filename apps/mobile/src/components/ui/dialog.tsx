import { ComponentProps } from 'react';
import { View } from 'react-native';
import { Modal, Portal, Surface } from 'react-native-paper';
import tw from 'twrnc';

import { TransButton } from '@/components/trans';

export function Dialog({
  children,
  onDismiss,
  ...props
}: ComponentProps<typeof Modal>) {
  return (
    <Portal>
      <Modal dismissable={true} onDismiss={onDismiss} {...props}>
        {children}
      </Modal>
    </Portal>
  );
}

export function DialogActionButton({
  compact = true,
  size = 'sm',
  ...props
}: ComponentProps<typeof TransButton>) {
  return (
    <View style={tw`flex-1`}>
      <TransButton compact={compact} size={size} {...props} />
    </View>
  );
}

export function DialogActions({
  children,
  style,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View style={tw`flex-row gap-2`} {...props}>
      {children}
    </View>
  );
}

export function DialogContent({
  children,
  style,
  ...props
}: ComponentProps<typeof Surface>) {
  return (
    <Surface style={[tw`m-4 gap-4 rounded-lg p-4`, style]} {...props}>
      {children}
    </Surface>
  );
}
