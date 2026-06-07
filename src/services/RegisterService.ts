import type { IRegisterInput } from '@/domain/auth/IRegisterInput';
import { BaseAuthService } from './BaseAuthService';
import { composeUrl } from '@/util/url-helpers';

export class RegisterService extends BaseAuthService<IRegisterInput> {
  async register(input: IRegisterInput) {
    const url = composeUrl({ endpoint: import.meta.env.VITE_API_REGISTER_ENDPOINT });
    return await this.authFetch(input, { url });
  }
}
