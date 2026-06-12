<script setup lang="ts">
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'project-type-created': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'projectTypeName' in formData && formData.projectTypeName?.trim() !== '';
</script>

<template>
  <AddModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entityTypeName="ProjectType"
    :repository="projectTypeRepo"
    :validate-form="validateForm"
    @entity-created="emit('project-type-created')"
  >
    <template #form-fields="{ updateData, formData }">
      <div class="mb-3">
        <label for="projectTypeName" class="form-label">Name *</label>
        <input
          type="text"
          class="form-control"
          id="projectTypeName"
          :value="formData.projectTypeName"
          @input="updateData('projectTypeName', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>

      <div class="mb-3">
        <label for="projectTypeDescription" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="projectTypeDescription"
          :value="formData.projectTypeDescription"
          @input="
            updateData('projectTypeDescription', ($event.target as HTMLTextAreaElement).value)
          "
        >
        </textarea>
      </div>
    </template>
  </AddModal>
</template>
