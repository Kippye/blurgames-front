import { Service } from '@angular/core';
import { IAuthor, IAuthorCreate } from './author.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class AuthorService extends ApiCrudService<IAuthor, IAuthorCreate> {
  protected override endpoint: string = environment.API_AUTHOR_ENDPOINT;
}
