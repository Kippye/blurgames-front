import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectAuthorRole from '@/domain/projectAuthorRole/IProjectAuthorRole';
import type IProjectAuthorRoleCreate from '@/domain/projectAuthorRole/IProjectAuthorRoleCreate';

export class ProjectAuthorRoleRepository extends BaseApiRepository<
  IProjectAuthorRole,
  IProjectAuthorRoleCreate,
  IProjectAuthorRole
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_AUTHOR_ROLE_ENDPOINT, authStore);
  }
}
