import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

import { MultiStepScreen, Step } from '@/components/ui/multistep';

export default function Form() {
  const { t } = useTranslation();

  return (
    <MultiStepScreen>
      <Step title='testing'>
        <Text>First</Text>
      </Step>
      <Step title={t('personalInfo.form.name.title')}>
        <Name />
      </Step>
      <Step title={t('personalInfo.form.dateOfBirth.title')}>
        <DOB />
      </Step>
    </MultiStepScreen>
  );
}

function DOB() {
  return (
    <View style={tw`flex-1`}>
      <Text>DOB</Text>
    </View>
  );
}

function Name() {
  return (
    <View style={tw`flex-1`}>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
      <Text>Hi</Text>
    </View>
  );
}
