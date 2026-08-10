<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { computed, onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { ProjectDetailsRepository } from '@/repositories/ProjectDetailsRepository';
import type { IResultObject } from '@/types/IResultObject';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { ProjectDetailsTagRepository } from '@/repositories/ProjectDetailsTagRepository';
import { ProjectDetailsGenreRepository } from '@/repositories/ProjectDetailsGenreRepository';
import { GenreRepository } from '@/repositories/GenreRepository';
import { TagRepository } from '@/repositories/TagRepository';
import { useRouter } from 'vue-router';
import DeleteProjectModal from '@/components/project-page/DeleteProjectModal.vue';
import ProjectPageDisplay from '@/components/project-page/ProjectPageDisplay.vue';
import type IProjectData from '@/types/IProjectData';
import type IProjectDetailsData from '@/types/IProjectDetailsData';
import type IGenre from '@/domain/genre/IGenre';
import type ITag from '@/domain/tag/ITag';
import ProjectPageEdit from '@/components/project-page/ProjectPageEdit.vue';
import { toRawDeep } from '@/util/object-helpers';
import type IProjectDetails from '@/domain/projectDetails/IProjectDetails';
import type IProjectDetailsCreate from '@/domain/projectDetails/IProjectDetailsCreate';

interface IProjectPageData {
  projectData: IProjectData;
  detailsData: IProjectDetailsData;
  genres: IGenre[];
  tags: ITag[];
}

const props = defineProps<{
  id: string;
}>();

const router = useRouter();

const authStore = useAuthStore();
const { getAuthInfo, getUserType } = authStore;
const projectRepo = new ProjectRepository(authStore);
const projectDetailsRepo = new ProjectDetailsRepository(authStore);
const projectTypeRepo = new ProjectTypeRepository(authStore);
const projectDetailsGenreRepo = new ProjectDetailsGenreRepository(authStore);
const genreRepo = new GenreRepository(authStore);
const projectDetailsTagRepo = new ProjectDetailsTagRepository(authStore);
const tagRepo = new TagRepository(authStore);

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
  const [genresResult, tagsResult] = await Promise.all([
    genreRepo.getAll(undefined, { key: 'genreName' }),
    tagRepo.getAll(undefined, { key: 'tagName' }),
  ]);

  errors = new Set<string>([...(genresResult.errors ?? []), ...(tagsResult.errors ?? [])]);
  if (errors.size > 0) {
    return { errors: Array.from(errors) };
  }

  const genresById = new Map(genresResult.data!.map((g) => [g.id, g]));
  const tagsById = new Map(tagsResult.data!.map((t) => [t.id, t]));

  return {
    data: {
      projectData: {
        project: project,
        projectType: projectTypeResult.data!,
      },
      detailsData: {
        projectDetails: projectDetails,
        projectGenres: projectGenreIds
          .filter((pGenreId) => genresById.has(pGenreId))
          .map((pGenreId) => genresById.get(pGenreId)!),
        projectTags: projectTagIds
          .filter((pTagId) => tagsById.has(pTagId))
          .map((pTagId) => tagsById.get(pTagId)!),
      },
      genres: genresResult.data!,
      tags: tagsResult.data!,
    },
  };
});

const {
  isLoading: isSavingDetails,
  error: saveDetailsError,
  execute: saveDetails,
  clear: clearSaveDetailsResult,
} = useApi(
  async (detailsCreate: IProjectDetailsCreate): Promise<IResultObject<IProjectDetails>> =>
    await projectDetailsRepo.add(detailsCreate),
);

onMounted(() => {
  window.scrollTo(0, 0);
  loadViewData();
});

const isOrphanModification = computed(
  () =>
    !isLoading.value &&
    data.value?.projectData.projectType.projectTypeName == 'Modification' &&
    data.value?.projectData.project.relatedProjectId == null,
);
const canModifyProject = computed(
  () =>
    getAuthInfo()?.userId == data.value?.projectData.project.uploaderId ||
    getUserType() === 'admin',
);
const projectTitle = computed(() => {
  if (isLoading.value) {
    return history.state?.title as string;
  } else if (editing.value) {
    return editDetailsData.value?.projectDetails.title;
  } else {
    return data.value?.detailsData.projectDetails.title;
  }
});

const showDeleteProjectModal = ref<boolean>(false);
const editing = ref<boolean>(false);
const preview = ref<boolean>(false);
const editProjectData = ref<IProjectData>();
const editDetailsData = ref<IProjectDetailsData>();

function openDeleteProjectModal() {
  if (data.value != null) {
    showDeleteProjectModal.value = true;
  }
}

function handleProjectDeleted() {
  router.push({ name: 'Projects' });
}

async function handleSaveEdits() {
  const detailsCreate: IProjectDetailsCreate = {
    ...editDetailsData.value!.projectDetails,
    genres: editDetailsData.value!.projectGenres.map((genre, index) => ({
      genreId: genre.id,
      orderIndex: index,
    })),
    tags: editDetailsData.value!.projectTags.map((tag, index) => ({
      tagId: tag.id,
      orderIndex: index,
    })),
  };

  await saveDetails(detailsCreate);
  if (saveDetailsError.value) {
    console.error(`Failed to save details:`, saveDetailsError.value);
    return;
  }
  // Go back to normal
  cancelEdits();
  clearSaveDetailsResult();
  // Get new data (latest ProjectDetails, etc.) from server
  loadViewData();
}

function switchToEditMode() {
  if (data.value == null) {
    return;
  }
  editing.value = true;
  preview.value = false;
  editProjectData.value = structuredClone(toRawDeep(data.value!.projectData));
  editDetailsData.value = structuredClone(toRawDeep(data.value!.detailsData));
}

function togglePreview() {
  if (!editing.value) {
    return;
  }
  preview.value = !preview.value;
}

function cancelEdits() {
  editProjectData.value = undefined;
  editDetailsData.value = undefined;
  editing.value = false;
  preview.value = false;
}
</script>

<template>
  <div v-if="isOrphanModification" class="alert alert-warning" role="alert">
    <strong>This modification is an orphan.</strong> The related project may have been deleted.
  </div>
  <div class="d-flex align-items-center">
    <h1 class="col">{{ projectTitle }}</h1>
    <div class="dropdown" v-if="!editing">
      <button
        class="btn dropdown-toggle"
        type="button"
        id="actionDropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Project actions"
      >
        <i class="bi bi-three-dots"></i>
      </button>
      <div class="dropdown-menu dropdown-menu-end" aria-labelledby="actionDropdownMenuButton">
        <span class="dropdown-item disabled">Nothing here yet</span>
        <div v-if="canModifyProject">
          <hr class="dropdown-divider" />
          <button class="dropdown-item" @click="switchToEditMode">
            Edit
            <i class="bi bi-pencil-fill text-warning"></i>
          </button>
          <button class="dropdown-item" type="button" @click="openDeleteProjectModal">
            Delete
            <i class="bi bi-trash-fill text-danger"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="editing">
      <button class="btn btn-primary" @click="togglePreview">
        {{ preview ? 'Edit' : 'Preview' }}
        <i :class="'bi ' + (preview ? 'bi-eye-slash' : 'bi-eye')"></i>
      </button>
    </div>
  </div>

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
      uploaded by <RouterLink to="">{{ data?.projectData.project.uploaderName }}</RouterLink>
    </h6>
    <ProjectPageDisplay
      v-if="!editing || preview"
      :project-data="editing ? editProjectData : data?.projectData"
      :details-data="editing ? editDetailsData : data?.detailsData"
    >
    </ProjectPageDisplay>
    <ProjectPageEdit
      v-else-if="editing && !preview && data && editProjectData && editDetailsData"
      v-model:project="editProjectData"
      v-model:details="editDetailsData"
      :og-details-data="data.detailsData"
      :og-project-data="data.projectData"
      :genres="data?.genres"
      :tags="data?.tags"
      :error="saveDetailsError"
      :is-saving="isSavingDetails"
      @edits-save="handleSaveEdits"
      @edits-cancel="cancelEdits"
    >
    </ProjectPageEdit>
    <DeleteProjectModal
      v-model="showDeleteProjectModal"
      :project="data?.projectData.project"
      :project-name="data?.detailsData.projectDetails.title"
      @project-deleted="handleProjectDeleted"
    />
  </div>
</template>
