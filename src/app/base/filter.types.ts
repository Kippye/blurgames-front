interface IFilterProperty<T> {
  value: T | null;
  invert?: boolean;
}

export type Filter<T> = {
  [K in keyof T]?: IFilterProperty<T[K]>;
};
