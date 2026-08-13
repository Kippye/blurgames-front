export interface IBaseEntity {
  id: string;
}

type Mapish = Record<string, unknown>;

interface IFilterProperty<T> {
  value: T | null;
  invert?: boolean;
}

export type Filter<T> = {
  [K in keyof T]?: IFilterProperty<T[K]>;
};

export interface Sort<T = Mapish> {
  key: keyof T;
  order?: 'asc' | 'desc';
}

export interface IResult<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

export class EmptyResult<T> implements IResult<T> {
  loading = false;
  data = null;
  error = null;
}

export class LoadingResult<T> implements IResult<T> {
  loading = true;
  data = null;
  error = null;
}
