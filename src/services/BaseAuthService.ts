import type { IAuthResponse } from '@/domain/auth/IAuthResponse';
import type { IApiFetchOptions } from '@/types/IApiFetchOptions';
import type { IResultObject } from '@/types/IResultObject';
import { HttpError } from '@/types/HttpError';

export abstract class BaseAuthService<T> {
  async authFetch(input: T, options: IApiFetchOptions): Promise<IResultObject<IAuthResponse>> {
    const response = await fetch(options.url, {
      method: 'POST',
      ...options.request,
      body: options.request?.body ?? JSON.stringify(input),
      headers: {
        ...options.request?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await HttpError.fromResponse(response);
      return { errors: [err.getUserMessage()] };
    }
    return { data: await response.json() };
  }
}
