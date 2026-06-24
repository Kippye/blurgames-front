import type IProject from '@/domain/project/IProject';
import { BaseApiRepository } from './BaseApiRepository';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type IProjectUpload from '@/domain/aggregate/IProjectUpload';
import type IProjectCreate from '@/domain/project/IProjectCreate';
import type { IResultObject } from '@/types/IResultObject';
import { composeUrl } from '@/util/url-helpers';
import type IProjectUpdate from '@/domain/project/IProjectUpdate';

export class ProjectRepository extends BaseApiRepository<IProject, IProjectCreate, IProjectUpdate> {
  constructor(authStore: IAuthStore) {
    super(import.meta.env.VITE_API_PROJECT_ENDPOINT, authStore);
  }

  async upload(project: IProjectUpload): Promise<IResultObject<IProject>> {
    const url = composeUrl({ endpoint: this.endpoint + '/upload' });
    const uploadJson = JSON.stringify(project);
    return await this.handleFetch({
      url,
      request: {
        body: uploadJson,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    });
  }
}
