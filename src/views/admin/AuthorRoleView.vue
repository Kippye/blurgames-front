<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import { onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import EditAuthorRoleModal from '@/components/admin/author-roles/EditAuthorRoleModal.vue';
import AddAuthorRoleModal from '@/components/admin/author-roles/AddAuthorRoleModal.vue';
import DeleteAuthorRoleModal from '@/components/admin/author-roles/DeleteAuthorRoleModal.vue';

const authStore = useAuthStore();
const authorRoleRepository = new AuthorRoleRepository(authStore);

const { data, error, execute: getAll, isLoading } = useApi(() => authorRoleRepository.getAll());

const showAddAuthorRoleModal = ref(false);
const showEditAuthorRoleModal = ref(false);
const showDeleteAuthorRoleModal = ref(false);
const selectedAuthorRole = ref<IAuthorRole | null>(null);
const authorRoleToDelete = ref<IAuthorRole | null>(null);

async function updateAuthorRoles() {
  await getAll();
}

onMounted(async () => await updateAuthorRoles());

function openAddModal() {
  showAddAuthorRoleModal.value = true;
}

function openEditModal(authorRole: IAuthorRole) {
  selectedAuthorRole.value = {
    ...authorRole,
  };
  showEditAuthorRoleModal.value = true;
}

function openDeleteModal(authorRole: IAuthorRole) {
  authorRoleToDelete.value = authorRole;
  showDeleteAuthorRoleModal.value = true;
}

async function handleAuthorRoleCreated() {
  await updateAuthorRoles();
}

async function handleAuthorRoleUpdated() {
  await updateAuthorRoles();
}

function handleEditModalClose() {
  selectedAuthorRole.value = null;
}

async function handleAuthorRoleDeleted() {
  await updateAuthorRoles();
}

function handleDeleteModalClose() {
  authorRoleToDelete.value = null;
}
</script>

<template>
  <h1>Author Roles</h1>

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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="authorRole in data" :key="authorRole.id">
          <td>{{ authorRole.authorRoleName }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" @click="openEditModal(authorRole)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(authorRole)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <EditAuthorRoleModal
      v-model="showEditAuthorRoleModal"
      :authorRole="selectedAuthorRole"
      @author-role-updated="handleAuthorRoleUpdated"
      @update:model-value="handleEditModalClose"
    />
    <AddAuthorRoleModal
      v-model="showAddAuthorRoleModal"
      @author-role-created="handleAuthorRoleCreated"
    />
    <DeleteAuthorRoleModal
      v-model="showDeleteAuthorRoleModal"
      :authorRole="authorRoleToDelete"
      @author-role-deleted="handleAuthorRoleDeleted"
      @update:model-value="handleDeleteModalClose"
    />
  </div>
</template>

<style scoped></style>
