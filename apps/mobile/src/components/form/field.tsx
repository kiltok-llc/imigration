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
import tw from 'twrnc';

<<<<<<< Updated upstream
import { FadeView } from '@/components/fade-view';

const FormFieldContext = createContext<UseControllerReturn>({
=======
import { WithRequired } from '@/lib/utils';

export const FormFieldContext = createContext<UseControllerReturn>({
>>>>>>> Stashed changes
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

  const {
    field: { disabled, onChange, value },
    formState: { defaultValues },
  } = controller;

  const currentValueRef = useRef(value);
  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  const { resetField, setValue } = useFormContext();

  useEffect(() => {
    // No reset logic if there's no active value
    if (activeValue === undefined) {
      return;
    }

    if (disabled) {
      console.debug(
        `Resetting field "${name}" to default value because it field was disabled.`
      );
      resetField(name);
    } else if (get(defaultValues, name) === currentValueRef.current) {
      console.debug(
        `Setting field "${name}" to active value: '${activeValue}' because field was enabled and current value is default.`
      );
      // @ts-ignore
      setValue(name, activeValue);
    }
  }, [
    activeValue,
    defaultValues,
    disabled,
    name,
    onChange,
    resetField,
    setValue,
  ]);

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      <FadeView style={tw`gap-4`} visible={active}>
        {children}
      </FadeView>
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
}: PropsWithChildren<UseControllerProps<TFieldValues, TName, TTransformedValues>>
) => {
  const controller = useController(props);

  return (
    <FormFieldContext.Provider value={controller as UseControllerReturn}>
      {children}
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => useContext(FormFieldContext);
