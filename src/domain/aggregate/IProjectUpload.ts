import type IProjectCreate from '../project/IProjectCreate';
import type IProjectDetailsCreate from '../projectDetails/IProjectDetailsCreate';

export interface IProjectAuthor {
  // Existing author
  authorId?: string;
  // OR name of new author
  name?: string;
  isNewAuthor: boolean;
  // Roles that the author has in this project
  roleIds: string[];
}

// TODO: These will likely be separate entities soon (with full info)
// So these might have to be named Upload entities as well
export interface IProjectDetailsGenre {
  genreId: string;
  orderIndex: number;
}

export interface IProjectDetailsTag {
  tagId: string;
  orderIndex: number;
}

export default interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: Omit<IProjectDetailsCreate, 'projectId'>;
  authors: IProjectAuthor[];
  genres: IProjectDetailsGenre[];
  tags: IProjectDetailsTag[];
}
