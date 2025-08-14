import { PrimitiveAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import { AtomFamily } from 'jotai/vanilla/utils/atomFamily';
import { Get, Paths } from 'type-fest';

// https://github.com/sindresorhus/type-fest/issues/991#issuecomment-2667426941
type ConvertToTemplateString<T> = T extends number ? `${T}` : T;

type KeyedAtomFamily<T> = AtomFamily<keyof T, PrimitiveAtom<T[keyof T]>>;

// strip out unnamed properties from AtomFamily
type KeyedAtomFamilyWithoutCallSignatures<T> = Pick<
  KeyedAtomFamily<T>,
  keyof KeyedAtomFamily<T>
>;

// add back call signature for properties in T
type ObjectPropertyAtomFamily<T> = KeyedAtomFamilyWithoutCallSignatures<T> & {
  <K extends Paths<T>>(
    key: K
  ): PrimitiveAtom<Get<T, ConvertToTemplateString<K>>>;
};

export const objectPropertyAtomFamily = <T>(objectAtom: PrimitiveAtom<T>) =>
  atomFamily((key: Paths<T>) =>
    focusAtom(objectAtom, (optic) => optic.path(key))
  ) as ObjectPropertyAtomFamily<T>;
