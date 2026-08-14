import type { IBaseEntity } from '../../base/domain.types';

export interface ITag extends IBaseEntity {
  tagName: string;
  tagDescription: string;
}

export interface ITagCreate {
  tagName: string;
  tagDescription: string;
}
