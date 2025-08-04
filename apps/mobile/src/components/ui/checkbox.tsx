import {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { View } from 'react-native';
import { CheckboxProps, Checkbox as PaperCheckbox } from 'react-native-paper';

import { arraysEqual } from '@/lib/utils';

type CheckboxGroupContextValue<T = string> = {
  onChange: (value: T[]) => void;
  value: T[];
};
const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({
  onChange: () => {},
  value: [],
});
// TODO is there a better way to do this typing?
const useCheckboxGroupContext = <T,>() =>
  useContext(CheckboxGroupContext) as unknown as CheckboxGroupContextValue<T>;

export function Checkbox<T>({
  exclusive = false,
  value,
  ...props
}: Omit<ComponentProps<typeof PaperCheckbox.Item>, 'status'> & {
  exclusive?: boolean;
  status?: CheckboxProps['status'];
  value: T;
}) {
  const { onChange, value: values } = useCheckboxGroupContext<T>();
  const checked = values.includes(value);

  const toggle = useCallback(() => {
    if (checked) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange(exclusive ? [value] : [...values, value]);
    }
  }, [checked, exclusive, onChange, value, values]);

  // Need to uncheck ourselves if we are exclusive but another box is checked
  useEffect(() => {
    if (exclusive && checked && !arraysEqual(values, [value])) {
      toggle();
    }
  }, [checked, exclusive, toggle, value, values]);

  return (
    <PaperCheckbox.Item
      onPress={toggle}
      status={checked ? 'checked' : 'unchecked'}
      {...props}
    />
  );
}

export function CheckboxGroup<T>({
  onChange,
  value,
  ...props
}: ComponentProps<typeof View> & {
  onChange: (value: T[]) => void;
  value: T[];
}) {
  return (
    // TODO more typing shenanigans to improve
    <CheckboxGroupContext.Provider
      value={{ onChange, value } as unknown as CheckboxGroupContextValue}
    >
      <View {...props} />
    </CheckboxGroupContext.Provider>
  );
}
