import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import {
  type unstable_AdapterOptions as AdapterOptions,
  unstable_createAdapterProvider as createAdapterProvider,
} from 'nuqs/adapters/custom';

function useNuqsExpoAdapter() {
  const router = useRouter();
  const searchParams = new URLSearchParams(useLocalSearchParams<Record<string, string>>());
  const updateUrl = (search: URLSearchParams, _options: AdapterOptions) => {
    router.setParams(Object.fromEntries(search) as Record<string, string>);
  };
  return {
    searchParams,
    updateUrl,
  };
}

export const NuqsAdapter = createAdapterProvider(useNuqsExpoAdapter);
