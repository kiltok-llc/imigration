import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react';
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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';

import { useIsFirstRender } from '@/hooks/use-is-first-render';
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

export const ConditionalFormFieldBlock = <
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
  activeValue?: PathValue<TFieldValues, TName>;
}) => {
  const controller = useController({
    disabled: !active,
    name,
    ...props,
  });

  const isFirstRender = useIsFirstRender();

  const {
    field: { disabled, value },
    formState: { defaultValues },
  } = controller;

  const { resetField, setValue } = useFormContext();

  const currentValueRef = useRef(value);
  currentValueRef.current = value;

  const activeValueRef = useRef<PathValue<TFieldValues, TName>>(activeValue);
  activeValueRef.current = activeValue;

  const defaultValueRef = useRef(get(defaultValues, name));
  defaultValueRef.current = get(defaultValues, name);

  useEffect(() => {
    // No reset logic if there's no active value
    if (activeValueRef.current === undefined) {
      return;
    }

    if (disabled) {
      // console.debug(
      //   `Resetting field "${name}" to default value because it field was disabled.`
      // );
      resetField(name);
    } else if (defaultValueRef.current === currentValueRef.current) {
      // console.debug(
      //   `Setting field "${name}" to active value: '${activeValueRef.current}' because field was enabled and current value is default.`
      // );
      setValue(name, activeValueRef.current);
    }
  }, [disabled, name, resetField, setValue]);

  if (!active) {
    return null;
  }

  return (
    <Animated.View
      entering={isFirstRender ? undefined : FadeIn}
      exiting={FadeOut}
      style={tw`gap-4`}
    >
      <FormFieldContext.Provider value={controller as UseControllerReturn}>
        {children}
      </FormFieldContext.Provider>
    </Animated.View>
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
