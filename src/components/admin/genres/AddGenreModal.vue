<script setup lang="ts">
import { ref, computed } from 'vue';
import type IGenreCreate from '@/domain/genre/IGenreCreate';
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import { useApi } from '@/composables/useApi';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'genre-created': [];
}>();

const authStore = useAuthStore();
const genreRepo = new GenreRepository(authStore);

const { error, execute: add } = useApi((create: IGenreCreate) => genreRepo.add(create));

const genreName = ref('');
const genreDescription = ref('');

const isFormValid = computed(() => {
  return genreName.value.trim() !== '';
});

async function handleCreate() {
  if (!isFormValid.value) {
    return;
  }

  const newItem: IGenreCreate = {
    genreName: genreName.value,
    genreDescription: genreDescription.value,
  };

  await add(newItem);

  if (error.value) {
    console.error('Failed to create genre:', error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('genre-created');
  resetForm();
}

function handleCancel() {
  emit('update:modelValue', false);
  resetForm();
}

function resetForm() {
  genreName.value = '';
  genreDescription.value = '';
}
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="addGenreModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addGenreModalLabel">Add New Genre</h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label for="genreName" class="form-label">Name *</label>
              <input type="text" class="form-control" id="genreName" v-model="genreName" required />
            </div>

            <div class="mb-3">
              <label for="genreDescription" class="form-label">Description</label>
              <textarea class="form-control" id="genreDescription" v-model="genreDescription">
              </textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleCancel">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleCreate"
            :disabled="!isFormValid"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade" :class="{ show: modelValue }"></div>
</template>

<style scoped></style>
