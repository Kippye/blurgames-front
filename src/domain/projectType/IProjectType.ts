import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectType extends IBaseEntity {
  projectTypeName: string;
  projectTypeDescription: string;
}
