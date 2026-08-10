// NOTE:
// - This does not have projectId because it's set from parent entities
// - This does not have projectDetailsId because every details edit creates a new ProjectDetails
export default interface IProjectDetailsGenreCreate {
  genreId: string;
  orderIndex: number;
}
