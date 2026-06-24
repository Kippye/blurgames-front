import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectAuthor from '@/domain/projectAuthor/IProjectAuthor';
import type IProjectAuthorCreate from '@/domain/projectAuthor/IProjectAuthorCreate';

export class ProjectAuthorRepository extends BaseApiRepository<
  IProjectAuthor,
  IProjectAuthorCreate,
  IProjectAuthor
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_AUTHOR_ENDPOINT, authStore);
  }
}
