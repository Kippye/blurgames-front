<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { GenreRepository } from '@/repositories/GenreRepository';
import { onMounted, ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type IGenre from '@/domain/genre/IGenre';
import EditGenreModal from '@/components/admin/genres/EditGenreModal.vue';
import AddGenreModal from '@/components/admin/genres/AddGenreModal.vue';
import DeleteGenreModal from '@/components/admin/genres/DeleteGenreModal.vue';

const authStore = useAuthStore();
const genreRepository = new GenreRepository(authStore);

const { data, error, execute: getAll, isLoading } = useApi(() => genreRepository.getAll());

const showAddGenreModal = ref(false);
const showEditGenreModal = ref(false);
const showDeleteGenreModal = ref(false);
const selectedGenre = ref<IGenre | null>(null);
const genreToDelete = ref<IGenre | null>(null);

async function updateGenres() {
  await getAll();
}

onMounted(async () => await updateGenres());

function openAddModal() {
  showAddGenreModal.value = true;
}

function openEditModal(genre: IGenre) {
  selectedGenre.value = {
    ...genre,
  };
  showEditGenreModal.value = true;
}

function openDeleteModal(genre: IGenre) {
  genreToDelete.value = genre;
  showDeleteGenreModal.value = true;
}

async function handleGenreCreated() {
  await updateGenres();
}

async function handleGenreUpdated() {
  await updateGenres();
}

function handleEditModalClose() {
  selectedGenre.value = null;
}

async function handleGenreDeleted() {
  await updateGenres();
}

function handleDeleteModalClose() {
  genreToDelete.value = null;
}
</script>

<template>
  <h1>Genres</h1>

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
        <tr v-for="genre in data" :key="genre.id">
          <td>{{ genre.genreName }}</td>
          <td>{{ genre.genreDescription }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" @click="openEditModal(genre)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="openDeleteModal(genre)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <EditGenreModal
      v-model="showEditGenreModal"
      :genre="selectedGenre"
      entity-name="Genre"
      @genre-updated="handleGenreUpdated"
      @update:model-value="handleEditModalClose"
    />
    <AddGenreModal
      v-model="showAddGenreModal"
      entity-name="Genre"
      @genre-created="handleGenreCreated"
    />
    <DeleteGenreModal
      v-model="showDeleteGenreModal"
      :genre="genreToDelete"
      entity-name="Genre"
      @genre-deleted="handleGenreDeleted"
      @update:model-value="handleDeleteModalClose"
    />
  </div>
</template>

<style scoped></style>
