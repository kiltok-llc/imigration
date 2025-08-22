import { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import {
  type FieldPath,
  type FieldValues,
  get,
  PathValue,
  useController,
  UseControllerProps,
  UseControllerReturn,
  useFormContext,
} from 'react-hook-form';

import { useLatestRef } from '@/hooks/use-latest-ref';
import { WithRequired } from '@/lib/utils';

export const FormFieldContext = createContext<UseControllerReturn>({
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

type NonUndefined<T> = T extends undefined ? never : T;

export const ConditionalFormWrapper = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
    active,
    activeValue,
    children,
    name,
    ...props
  }: PropsWithChildren<
  WithRequired<
    UseControllerProps<TFieldValues, TName, TTransformedValues>,
    'control'
  >
> & {
  active: boolean;
  activeValue: PathValue<TFieldValues, TName>;
}) => {
  const controller = useController({
    disabled: !active,
    name,
    ...props,
  });

  const {
    field: { disabled, value },
    formState: { defaultValues },
  } = controller;

  const { resetField, setValue } = useFormContext();

  useEffect(() => {
    if (disabled) {
      resetField(name);
    }
  }, [disabled, name, resetField]);

  useEffect(() => {
    if (!disabled && value === get(defaultValues, name) && activeValue !== undefined) {
      setValue(name, activeValue);
    }
  }, [activeValue, defaultValues, disabled, name, setValue, value]);

  if (disabled || value === get(defaultValues, name)) {
    return null;
  }

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      {children}
    </FormFieldContext.Provider>
  );
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
    children,
    ...props
  }: PropsWithChildren<
  UseControllerProps<TFieldValues, TName, TTransformedValues>
>) => {
  const controller = useController(props);

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      {children}
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => useContext(FormFieldContext);
