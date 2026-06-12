import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import type IAuthorRoleCreate from '@/domain/authorRole/IAuthorRoleCreate';

export class AuthorRoleRepository extends BaseApiRepository<
  IAuthorRole,
  IAuthorRoleCreate,
  IAuthorRole
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_AUTHORROLE_ENDPOINT, authStore);
  }
}
