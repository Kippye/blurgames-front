export interface IPagination {
  page: number;
  pageSize?: number;
}

export type Page = IPagination;

export interface IPaged<T> {
  items: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}
