import type { IBaseEntity } from '../IBaseEntity';

export default interface ITag extends IBaseEntity {
  tagName: string;
  tagDescription: string;
}
