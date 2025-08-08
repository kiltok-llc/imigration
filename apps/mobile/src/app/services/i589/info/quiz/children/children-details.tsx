import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Divider,
  IconButton,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import { toast } from 'sonner-native';
import tw from 'twrnc';

import { Trans } from '@/components/trans';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { Quiz, QuizPage } from '@/components/ui/quiz/screen';
import { answerFamily } from '@/lib/services/i589/info';

// Define the child type
type Child = {
  birthCity?: string;
  birthCountry?: string;
  dob?: string;
  ethnicity?: string;
  firstName?: string;
  lastName?: string;
  livesInUS?: boolean;
  middleName?: string;
  nationality?: string;
  sex?: 'female' | 'male';
};

export default function ChildrenDetails() {
  const { t } = useTranslation();
  const [hasChildren] = useAtom(answerFamily('hasChildren'));
  const [numberOfChildren] = useAtom(answerFamily('numberOfChildren'));
  const [children, setChildren] = useAtom(answerFamily('children'));
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  // Skip this page if no children
  if (hasChildren !== true) {
    return null;
  }

  // Initialize children array if needed
  if (!children || !Array.isArray(children)) {
    setChildren([]);
  }

  // Get the current child or create a new one
  const currentChild = children?.[currentChildIndex] || {};

  // Update a field for the current child
  const updateChildField = (field: keyof Child, value: any) => {
    const updatedChildren = [...(children || [])];
    if (!updatedChildren[currentChildIndex]) {
      updatedChildren[currentChildIndex] = {};
    }
    updatedChildren[currentChildIndex] = {
      ...updatedChildren[currentChildIndex],
      [field]: value,
    };
    setChildren(updatedChildren);
  };

  // Add a new child
  const addChild = () => {
    if (
      children &&
      children.length < Number.parseInt(numberOfChildren || '0', 10)
    ) {
      setChildren([...(children || []), {}]);
      setCurrentChildIndex(children.length);
    }
  };

  // Navigate to previous child
  const previousChild = () => {
    if (currentChildIndex > 0) {
      setCurrentChildIndex(currentChildIndex - 1);
    }
  };

  // Navigate to next child
  const nextChild = () => {
    if (currentChildIndex < (children?.length || 0) - 1) {
      setCurrentChildIndex(currentChildIndex + 1);
    }
  };

  // Check if all required fields are filled for the current child
  const isCurrentChildValid = () => {
    return (
      currentChild.lastName &&
      currentChild.firstName &&
      currentChild.sex &&
      currentChild.dob &&
      currentChild.birthCity &&
      currentChild.birthCountry &&
      currentChild.nationality &&
      currentChild.livesInUS !== undefined
    );
  };

  // Check if all children have been added and are valid
  const areAllChildrenValid = () => {
    if (
      !children ||
      children.length < Number.parseInt(numberOfChildren || '0', 10)
    ) {
      return false;
    }

    return children.every(
      (child) =>
        child.lastName &&
        child.firstName &&
        child.sex &&
        child.dob &&
        child.birthCity &&
        child.birthCountry &&
        child.nationality &&
        child.livesInUS !== undefined
    );
  };

  // Helper function to render child navigation controls
  const renderChildNavigation = () => (
    <>
      <Text style={tw`mb-2 text-lg font-bold`}>
        {t('services.i589.info.children.children-details.child_number', {
          current: currentChildIndex + 1,
          total: numberOfChildren,
        })}
      </Text>

      <View style={tw`mb-4 flex-row justify-between`}>
        <IconButton
          disabled={currentChildIndex === 0}
          icon='arrow-left'
          onPress={previousChild}
        />
        <IconButton
          disabled={currentChildIndex === (children?.length || 0) - 1}
          icon='arrow-right'
          onPress={nextChild}
        />
      </View>

      <Divider style={tw`mb-4`} />
    </>
  );

  // Helper function to check if basic information is valid
  const isBasicInfoValid = () => {
    return (
      currentChild.lastName &&
      currentChild.firstName &&
      currentChild.sex !== undefined
    );
  };

  // Helper function to check if birth information is valid
  const isBirthInfoValid = () => {
    return (
      currentChild.dob &&
      currentChild.birthCity &&
      currentChild.birthCountry &&
      currentChild.nationality
    );
  };

  // Helper function to check if additional information is valid
  const isAdditionalInfoValid = () => {
    return currentChild.livesInUS !== undefined;
  };

  return (
    <Quiz>
      {/* Page 1: Basic Information */}
      <QuizPage
        onSubmit={() => {
          if (!isBasicInfoValid()) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.children.children-details.title' />
        </FormLabel>

        <View style={tw`mb-4`}>
          {renderChildNavigation()}

          <FormLabel>
            <Trans i18nKey='services.i589.info.children.children-details.basic_info_title' />
          </FormLabel>

          <TextInput
            label={t('services.i589.info.children.children-details.last_name')}
            onChangeText={(value) => updateChildField('lastName', value)}
            value={currentChild.lastName}
          />

          <TextInput
            label={t('services.i589.info.children.children-details.first_name')}
            onChangeText={(value) => updateChildField('firstName', value)}
            value={currentChild.firstName}
          />

          <TextInput
            label={t(
              'services.i589.info.children.children-details.middle_name'
            )}
            onChangeText={(value) => updateChildField('middleName', value)}
            value={currentChild.middleName}
          />

          <FormLabel>
            <Trans i18nKey='services.i589.info.children.children-details.sex' />
          </FormLabel>
          <RadioButton.Group
            onValueChange={(value) =>
              updateChildField('sex', value as 'female' | 'male')
            }
            value={currentChild.sex || ''}
          >
            <RadioButton.Item
              label={t(
                'services.i589.info.children.children-details.sex_options.male'
              )}
              value='male'
            />
            <RadioButton.Item
              label={t(
                'services.i589.info.children.children-details.sex_options.female'
              )}
              value='female'
            />
          </RadioButton.Group>
        </View>
      </QuizPage>

      {/* Page 2: Birth Information */}
      <QuizPage
        onSubmit={() => {
          if (!isBirthInfoValid()) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <View style={tw`mb-4`}>
          {renderChildNavigation()}

          <FormLabel>
            <Trans i18nKey='services.i589.info.children.children-details.birth_info_title' />
          </FormLabel>

          <TextInput
            label={t('services.i589.info.children.children-details.dob')}
            onChangeText={(value) => updateChildField('dob', value)}
            placeholder='MM/DD/YYYY'
            value={currentChild.dob}
          />

          <TextInput
            label={t('services.i589.info.children.children-details.birth_city')}
            onChangeText={(value) => updateChildField('birthCity', value)}
            value={currentChild.birthCity}
          />

          <TextInput
            label={t(
              'services.i589.info.children.children-details.birth_country'
            )}
            onChangeText={(value) => updateChildField('birthCountry', value)}
            value={currentChild.birthCountry}
          />

          <TextInput
            label={t(
              'services.i589.info.children.children-details.nationality'
            )}
            onChangeText={(value) => updateChildField('nationality', value)}
            value={currentChild.nationality}
          />
        </View>
      </QuizPage>

      {/* Page 3: Additional Information */}
      <QuizPage
        onSubmit={() => {
          if (!isAdditionalInfoValid()) {
            toast.error(t('quiz.missing'));
            return false;
          }

          // Final validation to ensure all children are valid before proceeding
          if (!areAllChildrenValid()) {
            toast.error(t('quiz.missing'));
            return false;
          }

          return true;
        }}
      >
        <View style={tw`mb-4`}>
          {renderChildNavigation()}

          <FormLabel>
            <Trans i18nKey='services.i589.info.children.children-details.additional_info_title' />
          </FormLabel>

          <TextInput
            label={t('services.i589.info.children.children-details.ethnicity')}
            onChangeText={(value) => updateChildField('ethnicity', value)}
            value={currentChild.ethnicity}
          />

          <FormLabel>
            <Trans i18nKey='services.i589.info.children.children-details.lives_in_us' />
          </FormLabel>
          <FormBooleanInput
            onChange={(value) => updateChildField('livesInUS', value)}
            value={currentChild.livesInUS}
          />

          <Divider style={tw`my-4`} />

          {children &&
            children.length < Number.parseInt(numberOfChildren || '0', 10) && (
              <Button
                disabled={!isCurrentChildValid()}
                icon='plus'
                mode='contained'
                onPress={addChild}
                style={tw`mt-4`}
              >
                {t('services.i589.info.children.children-details.add_child')}
              </Button>
            )}
        </View>
      </QuizPage>
    </Quiz>
  );
}
