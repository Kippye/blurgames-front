import type IProject from '@/domain/project/IProject';
import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectUpload from '@/domain/aggregate/IProjectUpload';

export class ProjectRepository extends BaseApiRepository<IProject, IProjectUpload, IProject> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_ENDPOINT, authStore);
  }
}
