import { computed, signal, Signal } from '@angular/core';
import { rxResource, RxResourceOptions } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';

type RxResourceReturn<T, P> = ReturnType<typeof rxResource<T, P>>;

export interface CachedResourceRef<T, P = unknown> extends RxResourceReturn<T, P> {
  /** Last successfully loaded value, kept stable across reloads. `undefined` until the first success. */
  stableValue: Signal<T | undefined>;
  /** True only while loading the very first value (no data cached yet). */
  isInitialLoading: Signal<boolean>;
}

/**
 * Wraps `rxResource`, caching the last successfully emitted value in a stable
 * `loadedData()` signal that survives reloads (e.g. param changes). Exposes
 * `isInitialLoading()` so callers can show a spinner only on the first load,
 * while keeping the cached data visible during subsequent reloads.
 */
export function cachedRxResource<T, P = unknown>(
  options: RxResourceOptions<T, P>,
): CachedResourceRef<T, P> {
  const stableValue = signal<T | undefined>(undefined);

  const originalStream = options.stream;
  const source = rxResource<T, P>({
    ...options,
    stream: (param) => {
      const result = originalStream(param) as Observable<T>;
      return result.pipe(tap((value: T) => stableValue.set(value)));
    },
  });

  return Object.assign(source, {
    stableValue: stableValue,
    isInitialLoading: computed(() => source.isLoading() && stableValue() === undefined),
  }) as CachedResourceRef<T, P>;
}
