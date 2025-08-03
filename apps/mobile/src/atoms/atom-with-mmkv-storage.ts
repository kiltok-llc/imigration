import { atomWithStorage } from 'jotai/utils';
import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { MMKV } from 'react-native-mmkv';
import superjson from 'superjson';
import z from 'zod/v4';

const createMMKVStorage = <Value>(
  storage: MMKV,
  schema: z.ZodType<Value>
): SyncStorage<Value> => ({
  getItem(key, initialValue) {
    const str = storage.getString(key);
    // console.debug(`storage.getItem(${key}) = ${str}`);

    if (str === undefined) {
      return initialValue;
    }

    let value;
    try {
      value = superjson.parse(str);
    } catch (error) {
      console.warn(
        `Failed to parse mmkv key while reading from storage: ${key}`,
        error,
        str
      );
      return initialValue;
    }

    const { data, error } = schema.safeParse(value);
    if (error) {
      console.warn(
        `Value for key: ${key} was read as ${value} while reading from storage, but failed validation!`
      );
      console.warn(z.prettifyError(error));
      return initialValue;
    }

    return data;
  },
  removeItem(key) {
    // console.debug(`storage.removeItem(${key})`);
    storage.delete(key);
  },
  setItem(key, value) {
    const { error } = schema.safeParse(value);
    if (error) {
      console.warn(
        `Value for key: ${key} was set to ${value} while writing to storage, but failed validation!`
      );
      console.warn(z.prettifyError(error));
      return;
    }

    let str;
    try {
      str = superjson.stringify(value);
    } catch (error) {
      console.warn(
        `Failed to serialize value for key: ${key} while writing to storage`,
        error,
        value
      );
      return;
    }

    // console.debug(`storage.setItem(${key}, ${str})`);
    storage.set(key, str);
  },
  subscribe(key, callback) {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey !== key) {
        return;
      }

      const str = storage.getString(key);
      // console.debug(`storage.subscribe(${key}) = ${str}`);
      if (str === undefined) {
        console.warn(
          `MMKV value with key: ${key} was deleted, but subscription was active!`
        );
        return;
      }

      try {
        const value = superjson.parse(str);
        callback(schema.parse(value));
      } catch (error) {
        console.warn(
          `Error parsing mmkv value in subscription with key: ${key}`,
          error,
          str
        );
      }
    });
    return () => listener.remove();
  },
});

export const atomWithMmkvStorage = <T>(
  key: string,
  initialValue: T,
  schema: z.ZodType<T>,
  storage: MMKV
) =>
  atomWithStorage<T>(key, initialValue, createMMKVStorage(storage, schema), {
    getOnInit: true,
  });
