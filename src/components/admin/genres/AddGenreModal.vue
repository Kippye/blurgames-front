<script setup lang="ts">
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'genre-created': [];
}>();

const authStore = useAuthStore();
const genreRepo = new GenreRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'genreName' in formData && formData.genreName?.trim() !== '';
</script>

<template>
  <AddModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entityTypeName="Genre"
    :repository="genreRepo"
    :validate-form="validateForm"
    @entity-created="emit('genre-created')"
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
  </AddModal>
</template>
