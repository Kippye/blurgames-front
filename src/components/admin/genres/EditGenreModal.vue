<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type IGenre from '@/domain/genre/IGenre';
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import { useApi } from '@/composables/useApi';

const props = defineProps<{
  modelValue: boolean;
  genre: IGenre | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'genre-updated': [];
}>();

const authStore = useAuthStore();
const genreRepo = new GenreRepository(authStore);

const { error, execute: update } = useApi((update: IGenre) => genreRepo.update(update.id, update));

const genreName = ref('');
const genreDescription = ref('');

const isFormValid = computed(() => {
  return genreName.value != null && genreName.value.trim() !== '' && genreDescription.value != null;
});

async function handleUpdate() {
  if (!isFormValid.value) {
    return;
  }

  const newItem: IGenre = {
    id: props.genre!.id,
    genreName: genreName.value,
    genreDescription: genreDescription.value,
  };

  await update(newItem);

  if (error.value) {
    console.error('Failed to update genre:', error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('genre-updated');
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

function populateForm(genre: IGenre) {
  genreName.value = genre.genreName;
  genreDescription.value = genre.genreDescription;
}

watch(
  () => props.genre,
  (newGenre) => {
    if (newGenre) {
      populateForm(newGenre);
    }
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.genre) {
      populateForm(props.genre);
    }
  },
);
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="editGenreModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editGenreModalLabel">Edit Genre</h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdate">
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
            @click="handleUpdate"
            :disabled="!isFormValid"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade" :class="{ show: modelValue }"></div>
</template>

<style scoped></style>
