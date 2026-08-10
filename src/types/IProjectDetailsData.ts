import type IGenre from '@/domain/genre/IGenre';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type ITag from '@/domain/tag/ITag';

export default interface IProjectDetailsData {
  projectDetails: IProjectDetails;
  projectGenres: IGenre[];
  projectTags: ITag[];
}
