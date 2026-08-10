import { toRaw } from 'vue';

export function toRawDeep<T>(observed: T): T {
  const val = toRaw(observed);

  // add any classes, that you want to support:
  if (val instanceof Date) return val;

  if (Array.isArray(val)) {
    return val.map(toRawDeep) as T;
  }

  if (val === null) return null as T;

  if (typeof val === 'object') {
    const entries = Object.entries(val).map(([key, val]) => [key, toRawDeep(val)]);

    return Object.fromEntries(entries);
  }

  return val;
}
