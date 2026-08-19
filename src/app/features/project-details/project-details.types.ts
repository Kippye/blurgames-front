import { IBaseEntity } from '../../base/domain.types';
import { IProjectDetailsGenreCreate } from '../project-details-genres/project-details-genre.types';
import IProjectDetailsTagCreate from '../project-details-tags/project-details-tag.types';

export interface IProjectDetails extends IBaseEntity {
  projectId: string;
  title: string;
  shortDescription: string;
  description: string;
  publishedAt?: string;
  activeUntil?: string;
}

export interface IProjectDetailsCreate {
  projectId: string;
  title: string;
  shortDescription: string;
  description: string;
  genres: IProjectDetailsGenreCreate[];
  tags: IProjectDetailsTagCreate[];
}

export interface IProjectDetailsUpload extends Pick<
  IProjectDetailsCreate,
  'title' | 'description' | 'shortDescription'
> {
  genres: IProjectDetailsGenreCreate[];
  tags: IProjectDetailsTagCreate[];
}
