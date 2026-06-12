import type { IBaseEntity } from '../IBaseEntity';

export default interface IGenre extends IBaseEntity {
  genreName: string;
  genreDescription: string;
}
