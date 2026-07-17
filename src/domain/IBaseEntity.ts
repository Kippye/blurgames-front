export interface IBaseEntity {
  id: string;
}

type Mapish = { [k: string]: unknown };

interface IFilterProperty<T> {
  value: T | null;
  invert?: boolean;
}

export type Filter<T> = {
  [K in keyof T]?: IFilterProperty<T[K]>;
};

export type Sort<T = Mapish> = {
  key: keyof T;
  order: 'asc' | 'desc';
};
