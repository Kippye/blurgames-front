import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectAuthorRole extends IBaseEntity {
  projectId: string;
  projectAuthorId: string;
  authorRoleId: string;
}
