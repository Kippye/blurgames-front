import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectDetailsGenre from '@/domain/projectDetailsGenre/IProjectDetailsGenre';
import type IProjectDetailsGenreCreate from '@/domain/projectDetailsGenre/IProjectDetailsGenreCreate';

export class ProjectDetailsGenreRepository extends BaseApiRepository<
  IProjectDetailsGenre,
  IProjectDetailsGenreCreate,
  IProjectDetailsGenre
> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_DETAILS_GENRE_ENDPOINT, authStore);
  }
}
