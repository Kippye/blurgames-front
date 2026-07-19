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

// Data
interface IProjectPageData {
  project: IProject;
  projectDetails: IProjectDetails;
  projectType: IProjectType;
  /*
  projectGenres
  projectTags
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

  const baseErrors = new Set<string>([
    ...(projectResult.errors ?? []),
    ...(projectDetailsResult.errors ?? []),
  ]);

  if (projectDetailsResult.data!.length == 0) {
    baseErrors.add('Public and active project details not found');
  }

  // Return early if there were errors loading the base project data
  if (baseErrors.size > 0) {
    return { errors: Array.from(baseErrors) };
  }

  // Get additional data
  const [projectTypeResult] = await Promise.all([
    projectTypeRepo.get(projectResult.data!.projectTypeId),
    // ...
  ]);

  const extraErrors = new Set<string>([...(projectTypeResult.errors ?? [])]);

  if (extraErrors.size > 0) {
    return { errors: Array.from(extraErrors) };
  }

  return {
    data: {
      project: projectResult.data!,
      projectDetails: projectDetailsResult.data![0]!, // Use most recent project details
      projectType: projectTypeResult.data!,
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
      </tbody>
    </table>
    <p>
      {{ data?.projectDetails.description }}
    </p>
  </div>
</template>
