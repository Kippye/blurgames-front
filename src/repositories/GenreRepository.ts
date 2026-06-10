import type IGenre from '@/domain/genre/IGenre';
import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IGenreCreate from '@/domain/genre/IGenreCreate';

export class GenreRepository extends BaseApiRepository<IGenre, IGenreCreate, IGenre> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_GENRE_ENDPOINT, authStore);
  }
}
