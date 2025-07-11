import { useIsFocused } from '@react-navigation/native';
import {
  QueryKey,
  UseQueryOptions,
  useQuery as useReactQuery,
  useSuspenseQuery as useReactSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

export const useQuery = <Q, E, D, K extends QueryKey>(
  opts: UseQueryOptions<Q, E, D, K>
) => {
  const isFocused = useIsFocused();

  const result = useReactQuery({
    ...opts,
    subscribed: opts.subscribed && isFocused,
  });

  useRefreshOnFocus(result.refetch);

  return result;
};

export const useSuspenseQuery = <Q, E, D, K extends QueryKey>(
  opts: UseSuspenseQueryOptions<Q, E, D, K>
) => {
  const isFocused = useIsFocused();

  const result = useReactSuspenseQuery({
    ...opts,
    subscribed: opts.subscribed && isFocused,
  });

  useRefreshOnFocus(result.refetch);

  return result;
};
