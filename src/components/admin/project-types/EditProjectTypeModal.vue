<script setup lang="ts">
import type IProjectType from '@/domain/projectType/IProjectType';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';
import FormElement from '@/components/FormElement.vue';

const props = defineProps<{
  modelValue: boolean;
  projectType: IProjectType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'project-type-updated': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'projectTypeName' in formData &&
  formData.projectTypeName?.trim() !== '' &&
  'projectTypeDescription' in formData;
</script>

<template>
  <EditModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="ProjectType"
    :entity="projectType"
    :repository="projectTypeRepo"
    :validate-form="validateForm"
    @entity-updated="emit('project-type-updated')"
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
  </EditModal>
</template>

<style scoped></style>
