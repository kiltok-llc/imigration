import * as React from 'react';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  Controller,
  ControllerFieldState,
  type ControllerProps,
  ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  get,
  UseFormStateReturn,
} from 'react-hook-form';

import { FadeView } from '@/components/fade-view';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const FormFieldContext = createRequiredContext<{
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
}>();

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  name,
  visible,
  ...props
}: PropsWithChildren<Omit<ControllerProps<TFieldValues, TName>, 'render'>> & {
  visible?: boolean;
}) => {
  return (
    <Controller
      disabled={visible === false}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormFieldContext.Provider
          value={{
            field: field as ControllerRenderProps,
            fieldState,
            formState,
          }}
        >
          <FormFieldInner>
            <FadeView visible={visible}>{children}</FadeView>
          </FormFieldInner>
        </FormFieldContext.Provider>
      )}
      {...props}
    />
  );
};

function FormFieldInner({ children }: PropsWithChildren) {
  const {
    field: { disabled, name, onChange },
    formState: { defaultValues },
  } = useFormField();
  const defaultValue = useMemo(
    () => get(defaultValues, name),
    [defaultValues, name]
  );
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (disabled) {
      onChange();
    } else {
      onChange(defaultValueRef.current);
    }
  }, [disabled, onChange]);

  return children;
}

export const useFormField = () => useRequiredContext(FormFieldContext);
