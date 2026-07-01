export interface IBaseEntity {
  id: string;
}

type Mapish = { [k: string]: unknown };

export type IFilter<T = Mapish> = Partial<Omit<T, keyof IBaseEntity>>;

export type ISort<T = Mapish> = {
  sortBy: keyof T;
  sortDir: 'asc' | 'desc';
};
