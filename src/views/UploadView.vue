<script setup lang="ts">
import { ref, computed } from 'vue';
import type { IResultObject } from '@/types/IResultObject';
import { useApi } from '@/composables/useApi';
import type IProjectType from '@/domain/projectType/IProjectType';
import FormElement from '@/components/FormElement.vue';
import type IProject from '@/domain/project/IProject';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type IGenre from '@/domain/genre/IGenre';
import MultiselectSearchDropdown from '@/components/MultiselectSearchDropdown.vue';
import type ITag from '@/domain/tag/ITag';
import { useAuthStore } from '@/stores/auth-store';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import type IProjectUpload from '@/domain/aggregate/IProjectUpload';

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);

const {
  isLoading: isUploading,
  data: uploadResult,
  error: uploadError,
  execute: upload,
  clear: clearUploadResult,
} = useApi((upload: IProjectUpload) => {
  console.log('Uploading...');
  return new Promise<IResultObject<IProject>>((res) => {
    setTimeout(() => res({ data: { ...upload.project, id: '3', appUserId: '2' } }), 2000);
  });
});

// Mock data
const projectTypeData: IProjectType[] = [
  { id: '1', projectTypeName: 'Game', projectTypeDescription: 'Game' },
  { id: '2', projectTypeName: 'Modification', projectTypeDescription: 'Modification' },
];

const projectData: IProject[] = [
  { id: '1', projectTypeId: '1', appUserId: '1' },
  { id: '2', projectTypeId: '2', appUserId: '2' },
];

const projectDetailsData: IProjectDetails[] = [
  { id: '1', projectId: '1', title: 'Cool game', shortDescription: '', description: '' },
  { id: '2', projectId: '2', title: 'Mod of cool game', shortDescription: '', description: '' },
];

const genresData: IGenre[] = [
  { id: '1', genreName: 'Action', genreDescription: 'Explosions and stuff' },
  {
    id: '2',
    genreName: 'Activity',
    genreDescription:
      'This shall be a string of text a hundred characters long acting as a placeholder for testing purposes',
  },
  { id: '3', genreName: 'Platformer', genreDescription: 'Jumping around on platforms' },
];

const tagsData: ITag[] = [
  { id: '1', tagName: 'cool', tagDescription: 'Very cool' },
  { id: '2', tagName: 'awesome', tagDescription: 'Much awesome' },
  { id: '3', tagName: 'Stupid Game Jam 2026', tagDescription: 'Kinda lame' },
];

interface IProjectWithDetails extends IProject, IProjectDetails {}

// Project
const projectTypeId = ref<string>(projectTypeData[0]!.id);
const relatedProjectId = ref<string>();
/// Authors
// TODO
// Project details
const title = ref<string>('');
const shortDescription = ref<string>('');
const description = ref<string>('');
const selectedGenreIds = ref<string[]>([]);
const selectedTagIds = ref<string[]>([]);

const selectedProjectType = computed(() => {
  return projectTypeData.find((value: IProjectType) => value.id === projectTypeId.value);
});

const projectsWithDetails = computed(() => {
  return projectDetailsData.map((projectDetails) => {
    const projectWithDetails: IProjectWithDetails = {
      ...projectData.find((project) => project.id == projectDetails.projectId)!,
      ...projectDetails,
    };
    return projectWithDetails;
  });
});

const isFormValid = computed(() => {
  return (
    projectTypeId.value != undefined &&
    (selectedProjectType.value?.projectTypeName != 'Modification' ||
      relatedProjectId.value != undefined) &&
    0 < title.value.length &&
    title.value.length <= 100 &&
    shortDescription.value.length <= 60 &&
    description.value.length <= 1000
  );
});

async function handleUpload() {
  if (!isFormValid.value) {
    return;
  }

  const projectUpload: IProjectUpload = {
    project: {
      projectTypeId: projectTypeId.value,
      relatedProjectId: relatedProjectId.value,
    },
    projectDetails: {
      title: title.value,
      shortDescription: shortDescription.value,
      description: description.value,
    },
    authors: [],
  };

  await upload(projectUpload);

  if (uploadError.value) {
    console.error(`Failed to upload:`, uploadError.value);
    return;
  }

  console.log(uploadResult.value);

  // TODO: Redirect to the project's page
  // router.push(`/project/${uploadResult.id}`);
  // And then the whole resetForm function might become unnecessary
  resetForm();
}

function resetForm() {
  projectTypeId.value = projectTypeData[0]!.id;
  relatedProjectId.value = undefined;

  title.value = '';
  shortDescription.value = '';
  description.value = '';
  selectedGenreIds.value = [];
  selectedTagIds.value = [];

  clearUploadResult();
}
</script>

<template>
  <div class="page-content">
    <h1 class="page-title">Upload Project</h1>
    <div class="body">
      <form @submit.prevent="handleUpload">
        <FormElement id="projectTitle" label="Title" maxlength="70" required>
          <template #default="{ form }">
            <input
              type="text"
              class="form-control"
              v-model="title"
              :id="form.id"
              :maxlength="form.maxlength"
              :required="form.required"
            />
          </template>
        </FormElement>
        <FormElement id="projectType" label="Project Type" required>
          <select id="projectType" v-model="projectTypeId" class="form-select" required>
            <option
              v-for="projectType in projectTypeData"
              :key="projectType.id"
              :value="projectType.id"
            >
              {{ projectType.projectTypeName }}
            </option>
          </select>
        </FormElement>
        <FormElement
          id="relatedProject"
          label="Related Project"
          :required="selectedProjectType?.projectTypeName == 'Modification' ? true : undefined"
        >
          <select
            id="relatedProject"
            class="form-select"
            v-model="relatedProjectId"
            :required="selectedProjectType?.projectTypeName == 'Modification' ? true : undefined"
          >
            <option value=""></option>
            <option
              v-for="projectInfo in projectsWithDetails"
              :key="projectInfo.id"
              :value="projectInfo.id"
            >
              {{ projectInfo.title }}
            </option>
          </select>
        </FormElement>
        <!-- TODO: Authors section 💀 -->
        <FormElement id="shortDescription" label="Short Description" maxlength="60">
          <template #default="{ form }">
            <input
              type="text"
              class="form-control"
              v-model="shortDescription"
              :id="form.id"
              :maxlength="form.maxlength"
              :required="form.required"
            />
          </template>
        </FormElement>
        <FormElement id="description" label="Description" maxlength="1000">
          <template #default="{ form }">
            <textarea
              class="form-control"
              v-model="description"
              :id="form.id"
              :maxlength="form.id"
              :required="form.required"
            >
            </textarea>
          </template>
        </FormElement>
        <FormElement id="genres" label="Genres">
          <MultiselectSearchDropdown
            v-model="selectedGenreIds"
            :items="genresData"
            name-property="genreName"
            description-property="genreDescription"
          >
          </MultiselectSearchDropdown>
        </FormElement>
        <FormElement id="tags" label="Tags">
          <MultiselectSearchDropdown
            v-model="selectedTagIds"
            :items="tagsData"
            name-property="tagName"
            description-property="tagDescription"
          >
          </MultiselectSearchDropdown>
        </FormElement>
      </form>
      <div v-if="uploadError" class="alert alert-danger mt-3" role="alert">
        {{ uploadError }}
      </div>
    </div>
    <div class="footer">
      <button
        type="button"
        class="btn btn-primary"
        @click="handleUpload"
        :disabled="!isFormValid || isUploading"
      >
        <span
          v-if="isUploading"
          class="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isUploading ? 'Uploading...' : 'Upload' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
