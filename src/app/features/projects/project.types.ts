import { IBaseEntity } from '../../base/domain.types';
import { IProjectAuthorUpload } from '../project-authors/project-author.types';
import { IProjectDetails, IProjectDetailsUpload } from '../project-details/project-details.types';

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

export interface IProjectUpload {
  project: IProjectCreate;
  projectDetails: IProjectDetailsUpload;
  authors: IProjectAuthorUpload[];
}

export interface IProjectJoined {
  project: IProject;
  projectDetails: IProjectDetails;
}
