import type { IBaseEntity } from '../../base/base.types';

export interface IGenre extends IBaseEntity {
  genreName: string;
  genreDescription: string;
}

export interface IGenreCreate {
  genreName: string;
  genreDescription: string;
}
