import { ReactNode } from 'react';
import { View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import tw from 'twrnc';

export type Side = 'left' | 'right';

export function ChatBubble({
  label,
  side,
  text,
}: {
  label: ReactNode;
  side: Side;
  text: ReactNode;
}) {
  const theme = useTheme();

  return (
    <View style={tw`gap-1`}>
      <Text
        style={tw.style(side === 'left' ? 'self-start' : 'self-end', {
          color: theme.colors.onSurfaceVariant,
        })}
        variant='labelSmall'
      >
        {label}
      </Text>
      <Surface
        elevation={0}
        style={tw.style(
          'max-w-4/5 rounded-3xl px-4 py-3',
          side === 'left' ? 'self-start' : 'self-end',
          {
            backgroundColor:
              side === 'left'
                ? theme.colors.secondaryContainer
                : theme.colors.primary,
          }
        )}
      >
        <Text
          style={tw.style({
            color:
              side === 'left'
                ? theme.colors.onSecondaryContainer
                : theme.colors.onPrimary,
          })}
          variant='bodyLarge'
        >
          {text}
        </Text>
      </Surface>
    </View>
  );
}
