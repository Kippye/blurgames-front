import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type ITag from '@/domain/tag/ITag';
import type ITagCreate from '@/domain/tag/ITagCreate';

export class TagRepository extends BaseApiRepository<ITag, ITagCreate, ITag> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_TAG_ENDPOINT, authStore);
  }
}
