import { composeUrl, createQuery } from '@/util/url-helpers';
import { HttpError } from '@/types/HttpError';
import { useRouter } from 'vue-router';
import type { IResultObject } from '@/types/IResultObject';
import type { IApiFetchOptions } from '@/types/IApiFetchOptions';
import type { IAuthStore } from '@/domain/auth/IAuthStore';
import type { IApiErrorResponse } from '@/types/IApiErrorResponse';
import type { IBaseEntity, Filter, Sort } from '@/domain/IBaseEntity';

export abstract class BaseApiRepository<
  TEntity extends IBaseEntity,
  TCreate,
  TUpdate extends IBaseEntity,
> {
  protected authStore: IAuthStore;
  protected router = useRouter();
  protected endpoint: string;

  constructor(endpoint: string, authStore: IAuthStore) {
    this.endpoint = endpoint;
    this.authStore = authStore;
  }

  async apiFetch(options: IApiFetchOptions): Promise<Response> {
    const requestOptions = {
      ...options.request,
      headers: {
        ...options.request?.headers,
        Authorization: `Bearer ${this.getJwtToken()}`,
      },
      signal: AbortSignal.timeout(5000),
    };
    const response = await fetch(options.url, requestOptions);

    switch (response.status) {
      case 401:
        await this.authStore.refresh();
        if (!this.authStore.isLoggedIn()) {
          console.error('Failed to refresh tokens after unauthorized API request');
          this.router.push('login');
          return response;
        }

        const retryToken = this.getJwtToken();
        requestOptions.headers.Authorization = `Bearer ${retryToken}`;

        return fetch(options.url, requestOptions);
      default:
        return response;
    }
  }

  private getJwtToken(): string {
    const authInfo = this.authStore.getAuthInfo();
    if (!authInfo) {
      throw new Error('User not authenticated');
    }
    return authInfo.jwt;
  }

  protected async handleFetch<TResult>(options: IApiFetchOptions): Promise<IResultObject<TResult>> {
    try {
      const res = await this.apiFetch(options);

      // No content
      if (res.status === 204) {
        return { data: null as TResult };
      }
      // Success or user error
      if (res.ok || (400 <= res.status && res.status <= 499)) {
        try {
          // Success -> res.json() as data
          if (res.ok) {
            return { data: await res.json() };
          }
          // User error -> res.json() as error
          else {
            const apiError: IApiErrorResponse = await res.json();
            return { errors: [apiError.error] };
          }
        } catch {
          return { errors: ['Invalid response from server.'] };
        }
      }
      // Server error or other unexpected thing -> HTTP error message
      else {
        const err = await HttpError.fromResponse(res);
        return { errors: [err.getUserMessage()] };
      }
    } catch (error) {
      let message = 'Unknown fetch error';
      if (error instanceof Error) message = error.message;
      return { errors: [message] };
    }
  }

  async get(id: string): Promise<IResultObject<TEntity>> {
    const url = composeUrl({ endpoint: this.endpoint, id });
    return await this.handleFetch({ url });
  }

  async getAll(filter?: Filter<TEntity>, sort?: Sort<TEntity>): Promise<IResultObject<TEntity[]>> {
    const query = createQuery({ filter: JSON.stringify(filter), sort: JSON.stringify(sort) });
    const url = composeUrl({ endpoint: this.endpoint + '/all', query });
    return await this.handleFetch({ url });
  }

  async add(item: TCreate): Promise<IResultObject<TEntity>> {
    const url = composeUrl({ endpoint: this.endpoint });
    const itemJson = JSON.stringify(item);
    return await this.handleFetch({
      url,
      request: {
        body: itemJson,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    });
  }

  async update(item: TUpdate): Promise<IResultObject<TEntity>> {
    const url = composeUrl({ endpoint: this.endpoint, id: item.id });
    const itemJson = JSON.stringify(item);
    return await this.handleFetch({
      url,
      request: {
        body: itemJson,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
    });
  }

  // TODO: Delete doesn't return an actual entity result
  // So either make a non-generic IResultObject or use some other dummmy type
  async delete(id: string): Promise<IResultObject<TEntity>> {
    const url = composeUrl({ endpoint: this.endpoint, id });
    return await this.handleFetch({ url, request: { method: 'DELETE' } });
  }
}
