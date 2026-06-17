import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IAuthor from '@/domain/author/IAuthor';
import type IAuthorCreate from '@/domain/author/IAuthorCreate';

export class AuthorRepository extends BaseApiRepository<IAuthor, IAuthorCreate, IAuthor> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_AUTHOR_ENDPOINT, authStore);
  }
}
