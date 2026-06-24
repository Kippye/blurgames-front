export interface IBaseEntity {
  id: string;
}

export type IFilter<T> = Partial<Omit<T, keyof IBaseEntity>>;
