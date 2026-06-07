import { VueWrapper } from '@vue/test-utils';

/**
 * Type assertion helper for wrapper.vm to avoid TypeScript errors
 * Usage: const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
 */
export function getWrapperVm<T>(wrapper: VueWrapper): T {
  return wrapper.vm as unknown as T;
}
