import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectDetailsGenre extends IBaseEntity {
  projectId: string;
  projectDetailsId: string;
  genreId: string;
  orderIndex: number;
}
