<script setup lang="ts">
import { watch } from 'vue';
import type IProjectType from '@/domain/projectType/IProjectType';
import { useAuthStore } from '@/stores/auth-store';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useApi } from '@/composables/useApi';
import { toSeparateWords } from '@/util/string-helpers';

const props = defineProps<{
  modelValue: boolean;
  entityName: string;
  projectType: IProjectType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'projectType-deleted': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);

const { error, execute: executeDelete, clear } = useApi((id: string) => projectTypeRepo.delete(id));

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      clear();
    }
  },
);

async function handleDelete() {
  await executeDelete(props.projectType!.id);

  if (error.value) {
    console.error(`Failed to delete ${props.entityName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('projectType-deleted');
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
    aria-labelledby="deleteProjectTypeModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteProjectTypeModalLabel">
            Delete {{ toSeparateWords(entityName) }}
          </h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete the {{ toSeparateWords(entityName).toLowerCase() }} "{{
              projectType?.projectTypeName
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
