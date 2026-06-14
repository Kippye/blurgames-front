<script setup lang="ts">
import type IGenre from '@/domain/genre/IGenre';
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';
import FormElement from '@/components/FormElement.vue';

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
      <FormElement id="genreName" label="Name" required>
        <template #default="{ form }">
          <input
            type="text"
            class="form-control"
            :id="form.id"
            :value="formData.genreName"
            @input="updateData('genreName', ($event.target as HTMLInputElement).value)"
            :required="form.required"
          />
        </template>
      </FormElement>

      <FormElement id="genreDescription" label="Description">
        <template #default="{ form }">
          <textarea
            class="form-control"
            :id="form.id"
            :value="formData.genreDescription"
            @input="updateData('genreDescription', ($event.target as HTMLTextAreaElement).value)"
            :required="form.required"
          >
          </textarea>
        </template>
      </FormElement>
    </template>
  </EditModal>
</template>

<style scoped></style>
