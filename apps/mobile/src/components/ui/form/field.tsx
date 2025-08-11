import * as React from 'react';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  useController,
  UseControllerProps,
  UseControllerReturn,
  useFormContext,
} from 'react-hook-form';

import { FadeView } from '@/components/fade-view';

const FormFieldContext = createContext<UseControllerReturn>({
  field: {
    disabled: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    ref: () => {},
    value: undefined,
  },
  fieldState: {
    error: undefined,
    invalid: false,
    isDirty: false,
    isTouched: false,
    isValidating: false,
  },
  formState: {
    dirtyFields: {},
    disabled: false,
    errors: {},
    isDirty: false,
    isLoading: false,
    isReady: false,
    isSubmitSuccessful: false,
    isSubmitted: false,
    isSubmitting: false,
    isValid: true,
    isValidating: false,
    submitCount: 0,
    touchedFields: {},
    validatingFields: {},
  },
});

export const ConditionalFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  active,
  activeValue,
  children,
  name,
  ...props
}: PropsWithChildren<UseControllerProps<TFieldValues, TName>> & {
  active: boolean;
  activeValue: NonNullable<
    UseControllerProps<TFieldValues, TName>['defaultValue']
  >;
}) => {
  const controller = useController({
    disabled: !active,
    name,
    ...props,
  });

  const {
    field: { disabled, onChange },
  } = controller;

  const { resetField, setValue } = useFormContext();

  useEffect(() => {
    if (disabled) {
      console.debug(
        `Resetting field "${name}" to default value because it is disabled.`
      );
      resetField(name);
    } else {
      console.debug(`Setting field "${name}" to active value:`, activeValue);
      setValue(name, activeValue);
    }
  }, [activeValue, disabled, name, onChange, resetField, setValue]);

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      <FadeView visible={active}>{children}</FadeView>
    </FormFieldContext.Provider>
  );
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  ...props
}: PropsWithChildren<Omit<ControllerProps<TFieldValues, TName>, 'render'>>) => {
  const controller = useController(props);

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      {children}
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => useContext(FormFieldContext);
