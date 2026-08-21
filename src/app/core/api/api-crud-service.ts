import { inject } from '@angular/core';
import { ApiClient } from './api-client';
import { IBaseEntity } from '../../base/domain.types';
import { FilterNode } from '../../base/filter.types';
import { Sort } from '../../base/sort.types';
import { composeUrl, createQuery } from '../../util/url-helpers';
import { IPaged, Page } from '../../base/pagination.types';

/** Base API CRUD service for any DTO type. Cannot be injected itself. */
export abstract class ApiCrudService<
  T extends IBaseEntity,
  TCreate,
  TUpdate extends IBaseEntity = T,
> {
  protected readonly api = inject(ApiClient);
  protected abstract endpoint: string;

  getPaged(options: { filter?: FilterNode; sort?: Sort; page?: Page } = {}) {
    const query = createQuery({
      filter: JSON.stringify(options.filter),
      sort: JSON.stringify(options.sort),
      page: options.page?.page ?? undefined,
      pageSize: options.page?.pageSize ?? undefined,
    });
    const url = composeUrl({ endpoint: this.endpoint + '/all', query });
    return this.api.get<IPaged<T>>(url);
  }

  getCollection(options: { filter?: FilterNode; sort?: Sort } = {}) {
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
