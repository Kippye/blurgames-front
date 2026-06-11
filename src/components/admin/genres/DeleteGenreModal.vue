<script setup lang="ts">
import { watch } from 'vue';
import type IGenre from '@/domain/genre/IGenre';
import { useAuthStore } from '@/stores/auth-store';
import { GenreRepository } from '@/repositories/GenreRepository';
import { useApi } from '@/composables/useApi';
import { toSeparateWords } from '@/util/string-helpers';

const props = defineProps<{
  modelValue: boolean;
  entityName: string;
  genre: IGenre | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'genre-deleted': [];
}>();

const authStore = useAuthStore();
const genreRepo = new GenreRepository(authStore);

const { error, execute: executeDelete, clear } = useApi((id: string) => genreRepo.delete(id));

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      clear();
    }
  },
);

async function handleDelete() {
  await executeDelete(props.genre!.id);

  if (error.value) {
    console.error(`Failed to delete ${props.entityName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('genre-deleted');
}

function handleCancel() {
  emit('update:modelValue', false);
}
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="deleteGenreModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteGenreModalLabel">Delete {{ entityName }}</h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete the {{ toSeparateWords(entityName).toLowerCase() }} "{{
              genre?.genreName
            }}"?
          </p>
          <p class="text-muted">This action cannot be undone.</p>
          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleCancel">Cancel</button>
          <button type="button" class="btn btn-danger" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade" :class="{ show: modelValue }"></div>
</template>

<style scoped></style>
