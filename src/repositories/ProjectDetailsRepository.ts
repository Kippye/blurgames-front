import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type IProjectDetailsCreate from '@/domain/projectDetails/IProjectDetailsCreate';

export class ProjectDetailsRepository extends BaseApiRepository<
  IProjectDetails,
  IProjectDetailsCreate,
  IProjectDetails
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_DETAILS_ENDPOINT, authStore);
  }
}
