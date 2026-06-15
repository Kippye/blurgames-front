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
import type IAuthor from '@/domain/author/IAuthor';
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import type { IProjectAuthor } from '@/domain/aggregate/IProjectUpload';
import ComboboxWithCreate from '@/components/ComboboxWithCreate.vue';

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);

const {
  isLoading: isUploading,
  data: uploadResult,
  error: uploadError,
  execute: upload,
  clear: clearUploadResult,
} = useApi(async (upload: IProjectUpload) => {
  console.log('Uploading: ', JSON.stringify(upload, undefined, 2));
  const uploadResult = await projectRepo.add(upload);
  if (uploadResult.errors) {
    // TEMP to test without back-end
    return new Promise<IResultObject<IProject>>((res) => {
      setTimeout(() => res({ data: { ...upload.project, id: '3', appUserId: '2' } }), 2000);
    });
  }
  return uploadResult;
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

const authorsData: IAuthor[] = [
  { id: '1', name: 'zmateusz' },
  { id: '2', name: 'kip', appUserId: '1' },
];

const authorRolesData: IAuthorRole[] = [
  { id: '1', authorRoleName: 'Programmer' },
  { id: '2', authorRoleName: 'Artist' },
  { id: '3', authorRoleName: 'Tester' },
  { id: '4', authorRoleName: 'Composer' },
  { id: '5', authorRoleName: 'Designer' },
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
// Authors
const selectedAuthors = ref<IProjectAuthor[]>([]);

function handleAuthorSelect(selection: { id?: string; name: string; isNew: boolean }) {
  // Check if author already exists in the list
  if (selectedAuthors.value.find((a) => a.name?.toLowerCase() === selection.name.toLowerCase())) {
    // Don't add duplicates
    return;
  }

  const newAuthor: IProjectAuthor = {
    id: selection.id,
    name: selection.name,
    isNewAuthor: selection.isNew,
    roleIds: [],
  };

  selectedAuthors.value.push(newAuthor);
}

function removeAuthor(authorName: string) {
  selectedAuthors.value = selectedAuthors.value.filter((a) => a.name !== authorName);
}
// Project details
const title = ref<string>('');
const shortDescription = ref<string>('');
const description = ref<string>('');
const selectedGenreIds = ref<string[]>([]);
const selectedTagIds = ref<string[]>([]);

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
    authors: selectedAuthors.value,
    genres: selectedGenreIds.value.map((id) => ({ genreId: id })),
    tags: selectedTagIds.value.map((id) => ({ tagId: id })),
  };

  await upload(projectUpload);

  if (uploadError.value) {
    console.error(`Failed to upload:`, uploadError.value);
    return;
  }

  // TODO: Redirect to the project's page
  // (or maybe the server could send a Redirect response? I don't think REST APIs do that tho)
  // router.push(`/project/${uploadResult.id}`);
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
        <FormElement id="authors" label="Authors">
          <table class="table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Roles</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="author in selectedAuthors" :key="author.name!">
                <td>
                  <div class="d-flex align-items-center">
                    <span>{{ author.name }}</span>
                    <span v-if="author.isNewAuthor" class="badge bg-warning text-dark ms-2"
                      >NEW</span
                    >
                  </div>
                </td>
                <td>
                  <MultiselectSearchDropdown
                    v-model="author.roleIds"
                    :items="authorRolesData"
                    name-property="authorRoleName"
                    placeholder="Search roles..."
                  >
                  </MultiselectSearchDropdown>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn-close ms-1"
                    @click="removeAuthor(author.name!)"
                    aria-label="Remove author"
                  ></button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  <ComboboxWithCreate
                    :items="authorsData"
                    :existing-names="selectedAuthors.map((a) => a.name!)"
                    name-property="name"
                    placeholder="Search authors or type to add new..."
                    @select="handleAuthorSelect"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </FormElement>
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
