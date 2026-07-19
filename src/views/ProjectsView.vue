<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { computed, onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { ProjectDetailsRepository } from '@/repositories/ProjectDetailsRepository';
import type IProject from '@/domain/project/IProject';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type { IResultObject } from '@/types/IResultObject';
import { formatDate, parseDate } from '@/util/calendar-helpers';

/* Columns
 * ✅️ Title (ProjectDetails)
 * {Creator} - could be like "Boris Johnson + 6" and show the full list on click / hover
 * ✅️ ShortDescription (Details)
 * ✅️ Uploader (Project)
 * ReleaseDate / "Updated" (Last ProjectRelease date - WIP)
 * ✅️ UploadedAt (Project)
 */

/* What do we need to fetch?
 * Projects (duh)
 * Details (all? that could be huge later but ok all fow now) TODO: Fetch only active / latest ProjectDetails per project
 */

const sortBy = ref<'title' | 'uploadedAt'>('uploadedAt');
const sortDirection = ref<'asc' | 'desc'>('desc');

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);
const projectDetailsRepo = new ProjectDetailsRepository(authStore);

// Data
interface IListViewData {
  projects: IProject[];
  projectDetails: IProjectDetails[];
}

const {
  isLoading,
  data,
  error: viewDataError,
  execute: loadViewData,
} = useApi(async (): Promise<IResultObject<IListViewData>> => {
  const [projectResult, projectDetailsResult] = await Promise.all([
    projectRepo.getAll(
      undefined,
      sortBy.value == 'uploadedAt' ? { key: sortBy.value, order: sortDirection.value } : undefined,
    ),
    projectDetailsRepo.getAll(
      undefined,
      sortBy.value == 'title' ? { key: sortBy.value, order: sortDirection.value } : undefined,
    ),
  ]);

  const allErrors = new Set<string>([
    ...(projectResult.errors ?? []),
    ...(projectDetailsResult.errors ?? []),
  ]);

  if (allErrors.size > 0) {
    return { errors: Array.from(allErrors) };
  }

  return {
    data: {
      projects: projectResult.data ?? [],
      projectDetails: projectDetailsResult.data ?? [],
    },
  };
});

interface IProjectWithInfo {
  project: IProject;
  details: IProjectDetails;
}

// TODO: This doesn't handle multiple project details versions
// TODO: Figure out how to handle sorting here? Because if sorted by projects, i should map that; if sorted by details, i should map that
const projectsWithInfo = computed(() => {
  if (sortBy.value === 'title') {
    return data.value?.projectDetails.map((projectDetails) => {
      return {
        project: data.value!.projects.find((project) => project.id == projectDetails.projectId)!,
        details: projectDetails,
      } as IProjectWithInfo;
    });
  } else {
    return data.value?.projects.map((project) => {
      return {
        project,
        details: data.value!.projectDetails.find(
          (projectDetails) => projectDetails.projectId == project.id,
        )!,
      } as IProjectWithInfo;
    });
  }
});

onMounted(() => {
  loadViewData();
});
</script>

<template>
  <h1>Projects</h1>

  <div v-if="isLoading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="viewDataError" class="alert alert-danger">
    {{ viewDataError }}
  </div>

  <div v-else>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <!-- <th>Author</th> -->
          <th>Description</th>
          <th>Uploader</th>
          <!-- <th>Released</th> -->
          <th>Uploaded</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projectInfo in projectsWithInfo" :key="projectInfo.project.id">
          <td>
            <RouterLink
              :to="{
                name: 'Project',
                params: { id: projectInfo.project.id },
                state: { title: projectInfo.details.title },
              }"
              >{{ projectInfo.details.title }}</RouterLink
            >
          </td>
          <td>{{ projectInfo.details.shortDescription }}</td>
          <td>{{ projectInfo.project.uploaderName }}</td>
          <td>{{ formatDate(parseDate(projectInfo.project.uploadedAt)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
