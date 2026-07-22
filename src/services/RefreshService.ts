import type { IRefreshInput } from '@/domain/auth/IRefreshInput';
import { BaseAuthService } from './BaseAuthService';
import { composeUrl } from '@/util/url-helpers';

export class RefreshService extends BaseAuthService<IRefreshInput> {
  async refresh(input: IRefreshInput) {
    const url = composeUrl({ endpoint: import.meta.env.VITE_API_REFRESH_ENDPOINT });
    return await this.authFetch(input, { url });
  }
}
