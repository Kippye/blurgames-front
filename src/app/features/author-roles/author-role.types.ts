import type { IBaseEntity } from '../../base/domain.types';

export interface IAuthorRole extends IBaseEntity {
  authorRoleName: string;
}

export interface IAuthorRoleCreate {
  authorRoleName: string;
}
