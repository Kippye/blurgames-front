import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectDetailsTag extends IBaseEntity {
  projectDetailsId: string;
  tagId: string;
  orderIndex: number;
}
