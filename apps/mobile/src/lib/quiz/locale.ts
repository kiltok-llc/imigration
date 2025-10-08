import { useFormField } from '@/components/form/field';
import { useQuizPageId } from '@/components/quiz/page';
import { useLocalSegments } from '@/hooks/use-local-segments';

export function toI18nKey(name: string) {
  return name
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/.\d+/g, '')
    .toLowerCase();
}

export const useQuizFieldLocaleKey = (id: null | string, name?: string) => {
  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const pageId = useQuizPageId();
  const {
    field: { name: fieldName },
  } = useFormField();

  const key = `services.${service}.${step}.${screen}.${pageId}.${name ?? toI18nKey(fieldName)}`;

  if (id === null) {
    return key;
  }

  return `${key}.${toI18nKey(id)}`;
};

export const useQuizPageLocaleKey = (id: null | string) => {
  const [_services, service = '', step = '', ...screens] = useLocalSegments();
  const screen = screens.join('.');
  const pageId = useQuizPageId();

  const key = `services.${service}.${step}.${screen}.${pageId}`;

  if (id === null) {
    return key;
  }

  return `${key}.${id}`;
};
