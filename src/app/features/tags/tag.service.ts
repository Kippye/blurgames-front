import { Service } from '@angular/core';
import { ITag, ITagCreate } from './tag.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class TagService extends ApiCrudService<ITag, ITagCreate> {
  protected override endpoint: string = environment.API_TAG_ENDPOINT;
}
