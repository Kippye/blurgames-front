import type IAuthorCreate from '../author/IAuthorCreate';
import type IProjectCreate from '../project/IProjectCreate';
import type IProjectDetailsCreate from '../projectDetails/IProjectDetailsCreate';

export interface IProjectAuthor {
  // Existing author
  authorId?: string;
  // OR author to be created
  newAuthor?: IAuthorCreate;
  // Roles that the author has in this project
  roleIds: string[];
}

export default interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: Omit<IProjectDetailsCreate, 'projectId'>;
  authors: IProjectAuthor[];
}
