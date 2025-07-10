'use client';

import { Slot } from '@radix-ui/react-slot';
import { ComponentProps, ReactNode } from 'react';
import {
  ArrayPath,
  FieldArray,
  FieldArrayMethodProps,
  FieldArrayWithId,
  type FieldPath,
  type FieldValues,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form';
import { twc } from 'react-twc';

import { FormGlobalMessage } from '@/components/ui/form';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { cn, StyledProps, StyledPropsWithChildren } from '@/lib/utils';

type FormListContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
> = {
  append: UseFieldArrayAppend<TFieldValues, TName>;
  fields: FieldArrayWithId<TFieldValues, TName, TKeyName>[];
  name: TName;
  remove: UseFieldArrayRemove;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormListContext = createRequiredContext<FormListContextValue<any>>();

const useFormList = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>() =>
  useRequiredContext(FormListContext) as FormListContextValue<
    TFieldValues,
    TName
  >;

export const FormList = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>({
  children,
  className,
  name,
}: StyledPropsWithChildren<{
  name: TName;
}>) => {
  const { control } = useFormContext<TFieldValues>();
  const { append, fields, remove } = useFieldArray<TFieldValues, TName>({
    control,
    name,
  });
  return (
    <FormListContext.Provider value={{ append, fields, name, remove }}>
      <div className={cn('grid gap-4', className)}>{children}</div>
    </FormListContext.Provider>
  );
};

export const FormListItems = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>({
  children,
  className,
}: StyledProps<{
  children: (
    field: FieldArrayWithId<TFieldValues, TName>,
    index: number,
    remove: () => void
  ) => ReactNode;
}>) => {
  const { watch } = useFormContext<TFieldValues>();
  const { fields, name, remove } = useFormList<TFieldValues, TName>();
  const watchFields = watch(name as FieldPath<TFieldValues>);
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFields[index],
  }));

  return (
    <div className={cn('grid gap-6', className)}>
      {controlledFields.map((field, index) =>
        children(field, index, () => remove(index))
      )}
    </div>
  );
};

export function FormListAddButton<
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>({
  options,
  value,
  ...props
}: ComponentProps<typeof Slot> & {
  options?: FieldArrayMethodProps;
  value: FieldArray<TFieldValues, TName> | FieldArray<TFieldValues, TName>[];
}) {
  const { append } = useFormList<TFieldValues, TName>();
  return (
    <Slot
      data-slot='form-list-add'
      onClick={() => append(value, options)}
      {...props}
    />
  );
}

export function FormListMessage<
  TFieldValues extends FieldValues = FieldValues,
>({ ...props }: ComponentProps<'p'>) {
  const { name } = useFormList<TFieldValues>();
  return <FormGlobalMessage name={name} {...props} />;
}

export const FormListSubtitle = twc.p`text-muted-foreground mt-1 text-sm`;

export const FormListTitle = twc.p`leading-none font-medium`;

export const FormListHeader = twc.div``;
