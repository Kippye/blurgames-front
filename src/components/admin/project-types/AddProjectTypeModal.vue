<script setup lang="ts">
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';
import FormElement from '@/components/FormElement.vue';

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
      <FormElement id="projectTypeName" label="Name" required>
        <template #default="{ form }">
          <input
            type="text"
            class="form-control"
            :id="form.id"
            :value="formData.projectTypeName"
            @input="updateData('projectTypeName', ($event.target as HTMLInputElement).value)"
            :required="form.required"
          />
        </template>
      </FormElement>

      <FormElement id="projectTypeDescription" label="Description">
        <template #default="{ form }">
          <textarea
            class="form-control"
            :id="form.id"
            :value="formData.projectTypeDescription"
            @input="
              updateData('projectTypeDescription', ($event.target as HTMLTextAreaElement).value)
            "
            :required="form.required"
          >
          </textarea>
        </template>
      </FormElement>
    </template>
  </AddModal>
</template>
