import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectDetailsGenre extends IBaseEntity {
  projectDetailsId: string;
  genreId: string;
  orderIndex: number;
}
