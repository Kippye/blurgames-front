import type IProject from '@/domain/project/IProject';
import type IProjectType from '@/domain/projectType/IProjectType';

export default interface IProjectData {
  project: IProject;
  projectType: IProjectType;
  /*
  projectAuthors
  */
}
