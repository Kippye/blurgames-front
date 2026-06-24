import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectUpdate extends IBaseEntity {
  projectTypeId: string;
  relatedProjectId?: string;
}
