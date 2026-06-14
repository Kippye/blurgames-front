import type { IBaseEntity } from '../IBaseEntity';

export default interface IAuthor extends IBaseEntity {
  name: string;
  appUserId?: string;
}
