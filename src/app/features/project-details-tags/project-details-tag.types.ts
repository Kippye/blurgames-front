import { IBaseEntity } from '../../base/domain.types';

export interface IProjectDetailsTag extends IBaseEntity {
  projectId: string;
  projectDetailsId: string;
  tagId: string;
  orderIndex: number;
}

/** NOTE
- This does not have projectId because it's set from parent entities
- This does not have projectDetailsId because every details edit creates a new ProjectDetails
*/
export default interface IProjectDetailsTagCreate {
  tagId: string;
  orderIndex: number;
}
