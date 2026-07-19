<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import type { IProjectAuthorUpload } from '@/domain/aggregate/IProjectUpload';
import ComboboxWithCreate from '@/components/ComboboxWithCreate.vue';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import { GenreRepository } from '@/repositories/GenreRepository';
import { TagRepository } from '@/repositories/TagRepository';
import { AuthorRepository } from '@/repositories/AuthorRepository';
import { ProjectDetailsRepository } from '@/repositories/ProjectDetailsRepository';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);
const projectDetailsRepo = new ProjectDetailsRepository(authStore);
const projectTypeRepo = new ProjectTypeRepository(authStore);
const authorRepo = new AuthorRepository(authStore);
const authorRoleRepo = new AuthorRoleRepository(authStore);
const genreRepo = new GenreRepository(authStore);
const tagRepo = new TagRepository(authStore);

// Data
interface IFormData {
  projects: IProject[];
  projectDetails: IProjectDetails[];
  projectTypes: IProjectType[];
  authors: IAuthor[];
  authorRoles: IAuthorRole[];
  genres: IGenre[];
  tags: ITag[];
}

const {
  isLoading,
  data,
  error: formDataError,
  execute: loadFormData,
} = useApi(async (): Promise<IResultObject<IFormData>> => {
  // TODO: Might be better to merge these into one big request?
  const [
    projectResult,
    projectDetailsResult,
    projectTypesResult,
    authorsResult,
    authorRolesResult,
    genresResult,
    tagsResult,
  ] = await Promise.all([
    projectRepo.getAll(),
    projectDetailsRepo.getAll(),
    projectTypeRepo.getAll(),
    authorRepo.getAll(),
    authorRoleRepo.getAll(),
    genreRepo.getAll(),
    tagRepo.getAll(),
  ]);

  const allErrors = new Set<string>([
    ...(projectResult.errors ?? []),
    ...(projectDetailsResult.errors ?? []),
    ...(projectTypesResult.errors ?? []),
    ...(authorsResult.errors ?? []),
    ...(authorRolesResult.errors ?? []),
    ...(genresResult.errors ?? []),
    ...(tagsResult.errors ?? []),
  ]);

  if (allErrors.size > 0) {
    return { errors: Array.from(allErrors) };
  }

  return {
    data: {
      projects: projectResult.data ?? [],
      projectDetails: projectDetailsResult.data ?? [],
      projectTypes: projectTypesResult.data ?? [],
      authors: authorsResult.data ?? [],
      authorRoles: authorRolesResult.data ?? [],
      genres: genresResult.data ?? [],
      tags: tagsResult.data ?? [],
    },
  };
});

const {
  isLoading: isUploading,
  data: uploadResult,
  error: uploadError,
  execute: upload,
  clear: clearUploadResult,
} = useApi(async (upload: IProjectUpload) => await projectRepo.upload(upload));

// Project
const projectTypeId = ref<string>();
const relatedProjectId = ref<string>();

const selectedProjectType = computed(() => {
  return data.value?.projectTypes.find((value: IProjectType) => value.id === projectTypeId.value);
});

interface IProjectWithDetails {
  project: IProject;
  details: IProjectDetails;
}

const projectsWithDetails = computed(() => {
  return data.value?.projectDetails.map((projectDetails) => {
    const projectWithDetails: IProjectWithDetails = {
      project: data.value!.projects.find((project) => project.id == projectDetails.projectId)!,
      details: projectDetails,
    };
    return projectWithDetails;
  });
});
// Authors
const selectedAuthors = ref<IProjectAuthorUpload[]>([]);

function handleAuthorSelect(selection: { id?: string; name: string; isNew: boolean }) {
  // Check if author already exists in the list
  if (selectedAuthors.value.find((a) => a.name?.toLowerCase() === selection.name.toLowerCase())) {
    // Don't add duplicates
    return;
  }

  const newAuthor: IProjectAuthorUpload = {
    authorId: selection.id,
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
    projectTypeId.value !== undefined &&
    (selectedProjectType.value?.projectTypeName !== 'Modification' ||
      relatedProjectId.value !== undefined) &&
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

  // NOTE: Anything here with "!" must have been checked in isFormValid first.
  const projectUpload: IProjectUpload = {
    project: {
      projectTypeId: projectTypeId.value!,
      relatedProjectId: relatedProjectId.value,
    },
    projectDetails: {
      title: title.value,
      shortDescription: shortDescription.value,
      description: description.value,
    },
    authors: selectedAuthors.value,
    genres: selectedGenreIds.value.map((id, index) => ({ genreId: id, orderIndex: index })),
    tags: selectedTagIds.value.map((id, index) => ({ tagId: id, orderIndex: index })),
  };

  await upload(projectUpload);

  if (uploadError.value) {
    console.error(`Failed to upload:`, uploadError.value);
    return;
  }

  // Redirect to the project's page
  router.push({
    name: 'Project',
    params: { id: uploadResult.value!.id },
    state: { title: title.value },
  });
  clearUploadResult();
}

onMounted(() => {
  loadFormData();
  projectTypeId.value = data.value?.projectTypes[0]?.id;
});
</script>

<template>
  <div class="page-content">
    <h1 class="page-title">Upload Project</h1>
    <div v-if="isLoading || (!formDataError && !data)" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="formDataError" class="alert alert-danger">
      {{ formDataError }}
    </div>
    <div v-else class="body">
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
              v-for="projectType in data!.projectTypes"
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
              :key="projectInfo.project.id"
              :value="projectInfo.project.id"
            >
              {{ projectInfo.details.title }}
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
                    :items="data!.authorRoles"
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
                    :items="data!.authors"
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
            :items="data!.genres"
            name-property="genreName"
            description-property="genreDescription"
          >
          </MultiselectSearchDropdown>
        </FormElement>
        <FormElement id="tags" label="Tags">
          <MultiselectSearchDropdown
            v-model="selectedTagIds"
            :items="data!.tags"
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
