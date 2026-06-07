import type { ILoginInput } from '@/domain/auth/ILoginInput';
import { BaseAuthService } from './BaseAuthService';
import { composeUrl } from '@/util/url-helpers';

export class LoginService extends BaseAuthService<ILoginInput> {
  async login(input: ILoginInput) {
    const url = composeUrl({ endpoint: import.meta.env.VITE_API_LOGIN_ENDPOINT });
    return await this.authFetch(input, { url });
  }
}
