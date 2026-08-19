import { Service } from '@angular/core';
import { IProjectDetails, IProjectDetailsCreate } from './project-details.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class ProjectDetailsService extends ApiCrudService<IProjectDetails, IProjectDetailsCreate> {
  protected override endpoint: string = environment.API_PROJECT_DETAILS_ENDPOINT;
}
