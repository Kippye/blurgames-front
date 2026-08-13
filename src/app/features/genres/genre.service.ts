import { Service } from '@angular/core';
import { IGenre, IGenreCreate } from './genre.types';
import { environment } from '../../../environments/environment';
import { ApiCrudService } from '../../core/api/api-crud-service';

@Service()
export class GenreService extends ApiCrudService<IGenre, IGenreCreate> {
  protected override endpoint: string = environment.API_GENRE_ENDPOINT;
}
