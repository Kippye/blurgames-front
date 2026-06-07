import { ref } from 'vue';
import type { IResultObject } from '@/types/IResultObject';

export function useApi<T, Args extends readonly unknown[] = []>(
  apiFn: (...args: Args) => Promise<IResultObject<T>>,
) {
  const data = ref<T>();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (...args: Args) => {
    isLoading.value = true;
    error.value = null;

    const result = await apiFn(...args);

    if (result.errors && result.errors.length > 0) {
      error.value = result.errors.join(', ');
    } else {
      data.value = result.data;
    }
    isLoading.value = false;
  };

  return { data, isLoading, error, execute };
}
