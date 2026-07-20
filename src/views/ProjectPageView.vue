<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { ProjectDetailsRepository } from '@/repositories/ProjectDetailsRepository';
import type IProject from '@/domain/project/IProject';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type { IResultObject } from '@/types/IResultObject';
import type IProjectType from '@/domain/projectType/IProjectType';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { formatDate } from '@/util/calendar-helpers';
import { ProjectDetailsTagRepository } from '@/repositories/ProjectDetailsTagRepository';
import { ProjectDetailsGenreRepository } from '@/repositories/ProjectDetailsGenreRepository';
import type IGenre from '@/domain/genre/IGenre';
import type ITag from '@/domain/tag/ITag';
import { GenreRepository } from '@/repositories/GenreRepository';
import { TagRepository } from '@/repositories/TagRepository';

const props = defineProps<{
  id: string;
}>();

const projectTitle = (
  history.state as {
    title?: string;
  }
)?.title;

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);
const projectDetailsRepo = new ProjectDetailsRepository(authStore);
const projectTypeRepo = new ProjectTypeRepository(authStore);
const projectDetailsGenreRepo = new ProjectDetailsGenreRepository(authStore);
const genreRepo = new GenreRepository(authStore);
const projectDetailsTagRepo = new ProjectDetailsTagRepository(authStore);
const tagRepo = new TagRepository(authStore);

// Data
interface IProjectPageData {
  project: IProject;
  projectDetails: IProjectDetails;
  projectType: IProjectType;
  projectGenres: IGenre[];
  projectTags: ITag[];
  /*
  projectAuthors
  */
}

const {
  isLoading,
  data,
  error: viewDataError,
  execute: loadViewData,
} = useApi(async (): Promise<IResultObject<IProjectPageData>> => {
  const [projectResult, projectDetailsResult] = await Promise.all([
    projectRepo.get(props.id),
    // TODO: Filter to only published entries when project details publishing is implemented
    // TODO: Add "is still active" check when filters support such comparisons
    projectDetailsRepo.getAll(
      { projectId: { value: props.id } },
      { key: 'publishedAt', order: 'desc' },
    ),
  ]);

  let errors = new Set<string>([
    ...(projectResult.errors ?? []),
    ...(projectDetailsResult.errors ?? []),
  ]);
  if (projectDetailsResult.data!.length == 0) {
    errors.add('Public and active project details not found');
  }
  if (errors.size > 0) {
    return { errors: Array.from(errors) };
  }

  const project = projectResult.data!;
  const projectDetails = projectDetailsResult.data![0]!; // Use most recent project details

  // Get additional data
  const [projectTypeResult, projectDetailsGenresResult, projectDetailsTagsResult] =
    await Promise.all([
      projectTypeRepo.get(projectResult.data!.projectTypeId),
      projectDetailsGenreRepo.getAll(
        { projectDetailsId: { value: projectDetails.id } },
        { key: 'orderIndex' },
      ),
      projectDetailsTagRepo.getAll(
        { projectDetailsId: { value: projectDetails.id } },
        { key: 'orderIndex' },
      ),
      // ...
    ]);

  errors = new Set<string>([
    ...(projectTypeResult.errors ?? []),
    ...(projectDetailsGenresResult.errors ?? []),
    ...(projectDetailsTagsResult.errors ?? []),
  ]);
  if (errors.size > 0) {
    return { errors: Array.from(errors) };
  }

  // Get data at other end of projectDetails relations
  const projectGenreIds = projectDetailsGenresResult.data!.map((dg) => dg.genreId);
  const projectTagIds = projectDetailsTagsResult.data!.map((dt) => dt.tagId);
  const [genresResult, tagsResult] = await Promise.all([genreRepo.getAll(), tagRepo.getAll()]);

  errors = new Set<string>([...(genresResult.errors ?? []), ...(tagsResult.errors ?? [])]);
  if (errors.size > 0) {
    return { errors: Array.from(errors) };
  }

  const genresById = new Map(genresResult.data!.map((g) => [g.id, g]));
  const tagsById = new Map(tagsResult.data!.map((t) => [t.id, t]));

  return {
    data: {
      project: project,
      projectDetails: projectDetails,
      projectType: projectTypeResult.data!,
      projectGenres: projectGenreIds
        .filter((pGenreId) => genresById.has(pGenreId))
        .map((pGenreId) => genresById.get(pGenreId)!),
      projectTags: projectTagIds
        .filter((pTagId) => tagsById.has(pTagId))
        .map((pTagId) => tagsById.get(pTagId)!),
    },
  };
});

onMounted(() => {
  window.scrollTo(0, 0);
  loadViewData();
});
</script>

<template>
  <h1>{{ isLoading ? projectTitle : data?.projectDetails.title }}</h1>

  <div v-if="isLoading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="viewDataError" class="alert alert-danger">
    {{ viewDataError }}
  </div>

  <div v-else>
    <h6 class="text-muted">
      uploaded by <RouterLink to="">{{ data?.project.uploaderName }}</RouterLink>
    </h6>
    <table class="table table-sm">
      <tbody>
        <tr>
          <th scope="row">Type</th>
          <td>{{ data?.projectType.projectTypeName }}</td>
        </tr>
        <tr>
          <th scope="row">Short description</th>
          <td>{{ data?.projectDetails.shortDescription }}</td>
        </tr>
        <tr>
          <th scope="row">Created at</th>
          <td>{{ formatDate(new Date(data?.project.uploadedAt ?? '')) }}</td>
        </tr>
        <tr>
          <th scope="row">Genres</th>
          <td>
            <span
              class="badge bg-success me-2"
              v-for="genre in data?.projectGenres"
              :key="genre.id"
            >
              {{ genre.genreName }}
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row">Tags</th>
          <td>
            <span class="badge bg-primary me-2" v-for="tag in data?.projectTags" :key="tag.id">{{
              tag.tagName
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      {{ data?.projectDetails.description }}
    </p>
  </div>
</template>
