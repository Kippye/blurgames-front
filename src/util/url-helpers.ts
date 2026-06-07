export function composeUrl({
  domain = import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL_DEV
    : import.meta.env.VITE_API_BASE_URL,
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
