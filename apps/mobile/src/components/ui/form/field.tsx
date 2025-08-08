import * as React from 'react';
import { PropsWithChildren } from 'react';
import {
  Controller,
  ControllerFieldState,
  type ControllerProps,
  ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';

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
  ...props
}: PropsWithChildren<Omit<ControllerProps<TFieldValues, TName>, 'render'>>) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormFieldContext.Provider
          value={{
            field: field as ControllerRenderProps,
            fieldState,
            formState,
          }}
        >
          {children}
        </FormFieldContext.Provider>
      )}
      {...props}
    />
  );
};

export const useFormField = () => useRequiredContext(FormFieldContext);
