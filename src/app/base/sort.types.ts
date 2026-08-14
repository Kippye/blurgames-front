type Mapish = Record<string, unknown>;

export interface Sort<T = Mapish> {
  key: keyof T;
  order?: 'asc' | 'desc';
}
