import { Context, createContext, useContext } from 'react';

const DEFAULT_VALUE = Symbol('Required context default value');

export type RequiredContext<T> = Context<T | typeof DEFAULT_VALUE>;

export const createRequiredContext = <T>() =>
  createContext<T | typeof DEFAULT_VALUE>(DEFAULT_VALUE);

export const useRequiredContext = <T>(context: RequiredContext<T>) => {
  const value = useContext(context);

  if (value === DEFAULT_VALUE) {
    throw new Error(
      '`useRequiredContext` cannot be used outside of `Provider` of context'
    );
  }

  return value;
};
