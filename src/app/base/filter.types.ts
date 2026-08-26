type FilterLogic = 'and' | 'or';
type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gteq'
  | 'lt'
  | 'lteq'
  | 'contains'
  | 'containsExact'
  | 'isIn'
  | 'isNotIn'
  | 'isNull'
  | 'isNotNull';

export type FilterNode = IFilterCondition | IFilterNegate | IFilterGroup;

interface IFilterCondition {
  property: string;
  operator: FilterOperator;
  value?: unknown;
}

interface IFilterNegate {
  not: FilterNode;
}

interface IFilterGroup {
  logic: FilterLogic;
  conditions: FilterNode[];
}
