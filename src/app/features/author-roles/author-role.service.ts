import { Service } from '@angular/core';
import { IAuthorRole, IAuthorRoleCreate } from './author-role.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class AuthorRoleService extends ApiCrudService<IAuthorRole, IAuthorRoleCreate> {
  protected override endpoint: string = environment.API_AUTHOR_ROLE_ENDPOINT;
}
