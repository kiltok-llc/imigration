import * as React from 'react';
import { PropsWithChildren, useEffect } from 'react';
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
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';

const FormFieldContext = createRequiredContext<UseControllerReturn>();

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
      resetField(name);
    } else {
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

export const useFormField = () => useRequiredContext(FormFieldContext);
