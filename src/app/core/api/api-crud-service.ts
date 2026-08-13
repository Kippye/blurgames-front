import { inject } from '@angular/core';
import { ApiClient } from './api-client';
import { Filter, IBaseEntity, Sort } from '../../base/base.types';
import { composeUrl, createQuery } from '../../util/url-helpers';

/** Base API CRUD service for any DTO type. Cannot be injected itself. */
export abstract class ApiCrudService<
  T extends IBaseEntity,
  TCreate,
  TUpdate extends IBaseEntity = T,
> {
  private readonly api = inject(ApiClient);
  protected abstract endpoint: string;

  getCollection(options: { filter?: Filter<T>; sort?: Sort<T> } = {}) {
    const query = createQuery({
      filter: JSON.stringify(options.filter),
      sort: JSON.stringify(options.sort),
    });
    const url = composeUrl({ endpoint: this.endpoint + '/all', query });
    return this.api.get<T[]>(url);
  }

  get(id: string) {
    return this.api.get<T>(composeUrl({ endpoint: this.endpoint, id }));
  }

  create(dto: TCreate) {
    return this.api.post<T>(composeUrl({ endpoint: this.endpoint }), dto);
  }

  update(dto: TUpdate) {
    return this.api.put<T>(composeUrl({ endpoint: this.endpoint, id: dto.id }), dto);
  }

  delete(id: string) {
    return this.api.delete(composeUrl({ endpoint: this.endpoint, id: id }));
  }
}
