<script setup lang="ts">
import type IProjectType from '@/domain/projectType/IProjectType';
import { useAuthStore } from '@/stores/auth-store';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import DeleteModal from '@/components/DeleteModal.vue';

const props = defineProps<{
  modelValue: boolean;
  projectType: IProjectType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'project-type-deleted': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);
</script>

<template>
  <DeleteModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="ProjectType"
    :entity-name="projectType?.projectTypeName"
    :entity-id="projectType?.id"
    :repository="projectTypeRepo"
    @entity-deleted="emit('project-type-deleted')"
  >
  </DeleteModal>
</template>
