import type IProjectCreate from '../project/IProjectCreate';
import type IProjectDetailsUpload from './IProjectDetailsUpload';

export interface IProjectAuthorUpload {
  // Existing author
  authorId?: string;
  // OR name of new author
  name?: string;
  isNewAuthor: boolean;
  // Roles that the author has in this project
  roleIds: string[];
}

export default interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: IProjectDetailsUpload;
  authors: IProjectAuthorUpload[];
}
