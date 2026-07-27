<script setup lang="ts">
import type IProject from '@/domain/project/IProject';
import { useAuthStore } from '@/stores/auth-store';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import DeleteModal from '@/components/DeleteModal.vue';

defineProps<{
  modelValue: boolean;
  project: IProject | undefined;
  projectName: string | undefined;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'project-deleted': [];
}>();

const authStore = useAuthStore();
const projectRepo = new ProjectRepository(authStore);
</script>

<template>
  <DeleteModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="Project"
    :entity-name="projectName"
    :entity-id="project?.id"
    :repository="projectRepo"
    @entity-deleted="emit('project-deleted')"
  >
  </DeleteModal>
</template>
