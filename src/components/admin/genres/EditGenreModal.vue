<script setup lang="ts">
import type IGenre from '@/domain/genre/IGenre';
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';

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

const validateForm = (formData: Record<string, string>) =>
  'genreName' in formData && formData.genreName?.trim() !== '' && 'genreDescription' in formData;
</script>

<template>
  <EditModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="Genre"
    :entity="genre"
    :repository="genreRepo"
    :validate-form="validateForm"
    @entity-updated="emit('genre-updated')"
  >
    <template #form-fields="{ updateData, formData }">
      <div class="mb-3">
        <label for="genreName" class="form-label">Name *</label>
        <input
          type="text"
          class="form-control"
          id="genreName"
          :value="formData.genreName"
          @input="updateData('genreName', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>

      <div class="mb-3">
        <label for="genreDescription" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="genreDescription"
          :value="formData.genreDescription"
          @input="updateData('genreDescription', ($event.target as HTMLTextAreaElement).value)"
        >
        </textarea>
      </div>
    </template>
  </EditModal>
</template>

<style scoped></style>
