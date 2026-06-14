<script setup lang="ts">
import { GenreRepository } from '@/repositories/GenreRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';
import FormElement from '@/components/FormElement.vue';

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
  </AddModal>
</template>
