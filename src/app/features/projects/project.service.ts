import { Service } from '@angular/core';
import { IProject, IProjectCreate, IProjectUpload } from './project.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';
import { composeUrl } from '../../util/url-helpers';

@Service()
export class ProjectService extends ApiCrudService<IProject, IProjectCreate> {
  protected override endpoint: string = environment.API_PROJECT_ENDPOINT;

  upload(project: IProjectUpload) {
    return this.api.post<IProject>(composeUrl({ endpoint: this.endpoint + '/upload' }), project);
  }
}
