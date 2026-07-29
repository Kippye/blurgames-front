import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectDetailsTag extends IBaseEntity {
  projectId: string;
  projectDetailsId: string;
  tagId: string;
  orderIndex: number;
}
