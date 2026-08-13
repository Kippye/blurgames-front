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

export class ResultFactory {
  static empty<T>(): IResult<T> {
    return {
      loading: false,
      data: null,
      error: null,
    };
  }

  static loading<T>(): IResult<T> {
    return {
      loading: true,
      data: null,
      error: null,
    };
  }

  static error<T>(error: string): IResult<T> {
    return {
      loading: false,
      data: null,
      error,
    };
  }

  static success<T>(data: T): IResult<T> {
    return {
      loading: false,
      data,
      error: null,
    };
  }
}
