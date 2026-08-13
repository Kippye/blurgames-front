import { environment } from '../../environments/environment';

export function composeUrl({
  domain = environment.apiUrl,
  endpoint = '',
  id = '',
  query = new URLSearchParams({}),
}: {
  domain?: string;
  endpoint?: string;
  id?: string;
  query?: URLSearchParams;
} = {}): string {
  let url = `${domain}${endpoint}`;

  if (id.length > 0) {
    url = `${url}/${id}`;
  }

  if (query.size > 0) {
    url = `${url}?${query.toString()}`;
  }

  return url;
}

/**
 * Create a URLSearchParams object from the keys and values of multiple objects.
 * Feel free to pass in null / undefined.
 * Duplicate keys are not handled.
 */
export function createQuery(...args: object[]): URLSearchParams {
  const queryParams: Record<string, string> = {};

  args.forEach((obj) => {
    if (obj == null) {
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = String(value);
      }
    });
  });

  return new URLSearchParams(queryParams);
}
