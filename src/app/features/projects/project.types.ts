import { IBaseEntity } from '../../base/domain.types';
import { IProjectDetailsUpload } from '../project-details/project-details.types';

export interface IProject extends IBaseEntity {
  projectTypeId: string;
  relatedProjectId?: string;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: string;
}

export interface IProjectCreate {
  projectTypeId: string;
  relatedProjectId?: string;
}

export interface IProjectUpdate extends IBaseEntity {
  projectTypeId: string;
  relatedProjectId?: string;
}

export interface IProjectAuthorUpload {
  // Existing author
  authorId?: string;
  // OR name of new author
  name?: string;
  isNewAuthor: boolean;
  // Roles that the author has in this project
  roleIds: string[];
}

export interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: IProjectDetailsUpload;
  authors: IProjectAuthorUpload[];
}
