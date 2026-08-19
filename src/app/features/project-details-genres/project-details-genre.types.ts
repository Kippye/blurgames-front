import { IBaseEntity } from '../../base/domain.types';

export interface IProjectDetailsGenre extends IBaseEntity {
  projectId: string;
  projectDetailsId: string;
  genreId: string;
  orderIndex: number;
}

/**NOTE:
- This does not have projectId because it's set from parent entities
- This does not have projectDetailsId because every details edit creates a new ProjectDetails
*/
export interface IProjectDetailsGenreCreate {
  genreId: string;
  orderIndex: number;
}
