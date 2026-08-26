import type { IBaseEntity } from '../../base/domain.types';

export interface IAuthor extends IBaseEntity {
  displayName: string;
  appUserId: string;
  isActive: boolean;
}

export interface IAuthorCreate {
  displayName?: string;
  appUserId: string;
}
