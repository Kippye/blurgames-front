import { Service } from '@angular/core';
import { IProjectType, IProjectTypeCreate } from './project-type.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class ProjectTypeService extends ApiCrudService<IProjectType, IProjectTypeCreate> {
  protected override endpoint: string = environment.API_PROJECT_TYPE_ENDPOINT;
}
