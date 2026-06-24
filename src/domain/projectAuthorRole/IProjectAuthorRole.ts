import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectAuthorRole extends IBaseEntity {
  projectAuthorId: string;
  authorRoleId: string;
}
