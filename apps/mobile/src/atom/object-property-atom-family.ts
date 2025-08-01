import { PrimitiveAtom } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { atomFamily } from 'jotai/utils';
import { AtomFamily } from 'jotai/vanilla/utils/atomFamily';

type KeyedAtomFamily<T> = AtomFamily<keyof T, PrimitiveAtom<T[keyof T]>>;

// strip out unnamed properties from AtomFamily
type KeyedAtomFamilyWithoutCallSignatures<T> = Pick<KeyedAtomFamily<T>, keyof KeyedAtomFamily<T>>;

// add back call signature for properties in T
type ObjectPropertyAtomFamily<T> = KeyedAtomFamilyWithoutCallSignatures<T> & {
  <K extends keyof T>(key: K): PrimitiveAtom<T[K]>;
}

export const objectPropertyAtomFamily = <T>(objectAtom: PrimitiveAtom<T>) =>
  atomFamily((key: keyof T) => focusAtom(objectAtom, (optic) => optic.prop(key))) as ObjectPropertyAtomFamily<T>;
