import type IProjectDetailsCreate from '../projectDetails/IProjectDetailsCreate';
import type IProjectDetailsGenreCreate from '../projectDetailsGenre/IProjectDetailsGenreCreate';
import type IProjectDetailsTagCreate from '../projectDetailsTag/IProjectDetailsTagCreate';

export default interface IProjectDetailsUpload extends Pick<
  IProjectDetailsCreate,
  'title' | 'description' | 'shortDescription'
> {
  genres: IProjectDetailsGenreCreate[];
  tags: IProjectDetailsTagCreate[];
}
