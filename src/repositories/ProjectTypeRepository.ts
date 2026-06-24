import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectType from '@/domain/projectType/IProjectType';
import type IProjectTypeCreate from '@/domain/projectType/IProjectTypeCreate';

export class ProjectTypeRepository extends BaseApiRepository<
  IProjectType,
  IProjectTypeCreate,
  IProjectType
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_TYPE_ENDPOINT, authStore);
  }
}
