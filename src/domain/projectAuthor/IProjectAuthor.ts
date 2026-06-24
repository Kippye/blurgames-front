import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectAuthor extends IBaseEntity {
  projectId: string;
  authorId: string;
}
