import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectDetailsTag from '@/domain/projectDetailsTag/IProjectDetailsTag';
import type IProjectDetailsTagCreate from '@/domain/projectDetailsTag/IProjectDetailsTagCreate';

export class ProjectDetailsTagRepository extends BaseApiRepository<
  IProjectDetailsTag,
  IProjectDetailsTagCreate,
  IProjectDetailsTag
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_DETAILS_TAG_ENDPOINT, authStore);
  }
}
