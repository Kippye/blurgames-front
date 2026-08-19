export interface SortDefinition {
  property: string;
  order?: 'asc' | 'desc';
}

export type Sort = SortDefinition[];
