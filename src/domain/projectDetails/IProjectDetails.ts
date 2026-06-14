import type { IBaseEntity } from '../IBaseEntity';

export default interface IProjectDetails extends IBaseEntity {
  projectId: string;
  title: string;
  shortDescription: string;
  description: string;
  publishedAt?: string;
  activeUntil?: string;
}
