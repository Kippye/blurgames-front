import type { IBaseEntity } from '../IBaseEntity';

export default interface IProject extends IBaseEntity {
  projectTypeId: string;
  relatedProjectId?: string;
  appUserId: string;
}
