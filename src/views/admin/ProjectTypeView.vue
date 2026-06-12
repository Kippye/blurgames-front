<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type IProjectType from '@/domain/projectType/IProjectType';
import EditProjectTypeModal from '@/components/admin/project-types/EditProjectTypeModal.vue';
import AddProjectTypeModal from '@/components/admin/project-types/AddProjectTypeModal.vue';
import DeleteProjectTypeModal from '@/components/admin/project-types/DeleteProjectTypeModal.vue';

const authStore = useAuthStore();
const projectTypeRepository = new ProjectTypeRepository(authStore);

const { data, error, execute: getAll, isLoading } = useApi(() => projectTypeRepository.getAll());

const showAddProjectTypeModal = ref(false);
const showEditProjectTypeModal = ref(false);
const showDeleteProjectTypeModal = ref(false);
const selectedProjectType = ref<IProjectType | null>(null);
const projectTypeToDelete = ref<IProjectType | null>(null);

async function updateProjectTypes() {
  await getAll();
}

onMounted(async () => await updateProjectTypes());

function openAddModal() {
  showAddProjectTypeModal.value = true;
}

function openEditModal(projectType: IProjectType) {
  selectedProjectType.value = {
    ...projectType,
  };
  showEditProjectTypeModal.value = true;
}

function openDeleteModal(projectType: IProjectType) {
  projectTypeToDelete.value = projectType;
  showDeleteProjectTypeModal.value = true;
}

async function handleProjectTypeCreated() {
  await updateProjectTypes();
}

async function handleProjectTypeUpdated() {
  await updateProjectTypes();
}

function handleEditModalClose() {
  selectedProjectType.value = null;
}

async function handleProjectTypeDeleted() {
  await updateProjectTypes();
}

function handleDeleteModalClose() {
  projectTypeToDelete.value = null;
}
</script>

<template>
  <h1>Project Types</h1>

  <div v-if="isLoading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="error" class="alert alert-danger">
    {{ error }}
  </div>

  <div v-else>
    <button class="btn btn-primary mb-3" @click="openAddModal()">Add</button>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projectType in data" :key="projectType.id">
          <td>{{ projectType.projectTypeName }}</td>
          <td>{{ projectType.projectTypeDescription }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" @click="openEditModal(projectType)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(projectType)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <EditProjectTypeModal
      v-model="showEditProjectTypeModal"
      :projectType="selectedProjectType"
      @project-type-updated="handleProjectTypeUpdated"
      @update:model-value="handleEditModalClose"
    />
    <AddProjectTypeModal
      v-model="showAddProjectTypeModal"
      @project-type-created="handleProjectTypeCreated"
    />
    <DeleteProjectTypeModal
      v-model="showDeleteProjectTypeModal"
      :projectType="projectTypeToDelete"
      @project-type-deleted="handleProjectTypeDeleted"
      @update:model-value="handleDeleteModalClose"
    />
  </div>
</template>

<style scoped></style>
