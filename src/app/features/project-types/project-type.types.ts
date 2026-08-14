import type { IBaseEntity } from '../../base/domain.types';

export interface IProjectType extends IBaseEntity {
  projectTypeName: string;
  projectTypeDescription: string;
}

export interface IProjectTypeCreate {
  projectTypeName: string;
  projectTypeDescription: string;
}
