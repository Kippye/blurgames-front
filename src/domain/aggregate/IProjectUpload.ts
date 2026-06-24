import type IProjectCreate from '../project/IProjectCreate';
import type IProjectDetailsCreate from '../projectDetails/IProjectDetailsCreate';

export interface IProjectAuthorUpload {
  // Existing author
  authorId?: string;
  // OR name of new author
  name?: string;
  isNewAuthor: boolean;
  // Roles that the author has in this project
  roleIds: string[];
}

export interface IProjectDetailsGenreUpload {
  genreId: string;
  orderIndex: number;
}

export interface IProjectDetailsTagUpload {
  tagId: string;
  orderIndex: number;
}

export default interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: Omit<IProjectDetailsCreate, 'projectId'>;
  authors: IProjectAuthorUpload[];
  genres: IProjectDetailsGenreUpload[];
  tags: IProjectDetailsTagUpload[];
}
