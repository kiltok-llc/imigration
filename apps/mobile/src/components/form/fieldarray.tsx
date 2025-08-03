import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';
import {
  ArrayPath,
  FieldArrayMethodProps,
  type FieldValues,
  Path,
  useController,
  UseControllerReturn,
  useFieldArray,
  UseFieldArrayProps,
  UseFieldArrayReturn,
} from 'react-hook-form';
import tw from 'twrnc';

import {
  FormField,
  FormFieldContext,
  useFormField,
} from '@/components/form/field';
import { TransButton } from '@/components/trans';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { TranslationContextProvider } from '@/lib/translation';
import { WithRequired } from '@/lib/utils';

const FormFieldArrayItemContext = createRequiredContext<number>();

export const useFormFieldArrayItem = () =>
  useRequiredContext(FormFieldArrayItemContext);

const FormFieldArrayContext = createContext<UseFieldArrayReturn>({
  append: () => {},
  fields: [],
  insert: () => {},
  move: () => {},
  prepend: () => {},
  remove: () => {},
  replace: () => {},
  swap: () => {},
  update: () => {},
});

export const FormArray = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
  TTransformedValues = TFieldValues,
>({
  children,
  ...props
}: PropsWithChildren<
  WithRequired<
    UseFieldArrayProps<TFieldValues, TName, TKeyName, TTransformedValues>,
    'control'
  >
>) => {
  const fieldArray = useFieldArray(props);

  const { control, name } = props;
  const controller = useController({
    control,
    name: name as Path<TFieldValues>,
  });

  return (
    <FormFieldArrayContext.Provider value={fieldArray as UseFieldArrayReturn}>
      <FormFieldContext.Provider value={controller as UseControllerReturn}>
        {children}
      </FormFieldContext.Provider>
    </FormFieldArrayContext.Provider>
  );
};

export const useFormArray = () => useContext(FormFieldArrayContext);

export function FormArrayAdd({
  i18nKey,
  options,
  value,
}: {
  i18nKey?: string;
  options?: FieldArrayMethodProps;
  value: any;
}) {
  const { append } = useFormArray() as UseFieldArrayReturn;
  return (
    <TransButton
      contentStyle={tw`flex-row-reverse`}
      i18nKey={i18nKey ?? 'form.fieldarray.add'}
      icon='plus'
      onPress={() => append(value, { shouldFocus: false, ...options })}
    />
  );
}

export function FormArrayItems({
  children,
}: {
  children: (index: number) => ReactNode;
}) {
  const { fields } = useFormArray() as UseFieldArrayReturn;
  const {
    field: { name },
  } = useFormField();

  return fields.map(({ id }, index) => (
    <FormField key={id} name={`${name}.${index}`}>
      <FormFieldArrayItemContext.Provider value={index}>
        <TranslationContextProvider
          value={{ count: index + 1, values: { ordinal: true } }}
        >
          {children(index)}
        </TranslationContextProvider>
      </FormFieldArrayItemContext.Provider>
    </FormField>
  ));
}
