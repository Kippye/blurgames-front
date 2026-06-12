<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { TagRepository } from '@/repositories/TagRepository';
import { onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type ITag from '@/domain/tag/ITag';
import EditTagModal from '@/components/admin/tags/EditTagModal.vue';
import AddTagModal from '@/components/admin/tags/AddTagModal.vue';
import DeleteTagModal from '@/components/admin/tags/DeleteTagModal.vue';

const authStore = useAuthStore();
const tagRepository = new TagRepository(authStore);

const { data, error, execute: getAll, isLoading } = useApi(() => tagRepository.getAll());

const showAddTagModal = ref(false);
const showEditTagModal = ref(false);
const showDeleteTagModal = ref(false);
const selectedTag = ref<ITag | null>(null);
const tagToDelete = ref<ITag | null>(null);

async function updateTags() {
  await getAll();
}

onMounted(async () => await updateTags());

function openAddModal() {
  showAddTagModal.value = true;
}

function openEditModal(tag: ITag) {
  selectedTag.value = {
    ...tag,
  };
  showEditTagModal.value = true;
}

function openDeleteModal(tag: ITag) {
  tagToDelete.value = tag;
  showDeleteTagModal.value = true;
}

async function handleTagCreated() {
  await updateTags();
}

async function handleTagUpdated() {
  await updateTags();
}

function handleEditModalClose() {
  selectedTag.value = null;
}

async function handleTagDeleted() {
  await updateTags();
}

function handleDeleteModalClose() {
  tagToDelete.value = null;
}
</script>

<template>
  <h1>Tags</h1>

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
        <tr v-for="tag in data" :key="tag.id">
          <td>{{ tag.tagName }}</td>
          <td>{{ tag.tagDescription }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" @click="openEditModal(tag)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(tag)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <EditTagModal
      v-model="showEditTagModal"
      :tag="selectedTag"
      @tag-updated="handleTagUpdated"
      @update:model-value="handleEditModalClose"
    />
    <AddTagModal v-model="showAddTagModal" @tag-created="handleTagCreated" />
    <DeleteTagModal
      v-model="showDeleteTagModal"
      :tag="tagToDelete"
      @tag-deleted="handleTagDeleted"
      @update:model-value="handleDeleteModalClose"
    />
  </div>
</template>

<style scoped></style>
