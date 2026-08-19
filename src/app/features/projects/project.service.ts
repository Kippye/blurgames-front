import { Service } from '@angular/core';
import { IProject, IProjectCreate } from './project.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class ProjectService extends ApiCrudService<IProject, IProjectCreate> {
  protected override endpoint: string = environment.API_PROJECT_ENDPOINT;
}
