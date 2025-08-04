import { ComponentProps } from 'react';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

export function QuizPrimaryQuestionText({
  children,
  style,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      style={[tw`mb-8 text-center font-bold`, style]}
      variant='headlineMedium'
      {...props}
    >
      {children}
    </Text>
  );
}
