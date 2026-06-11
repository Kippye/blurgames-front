<script setup lang="ts">
import { ref, computed } from 'vue';
import type IProjectTypeCreate from '@/domain/projectType/IProjectTypeCreate';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useAuthStore } from '@/stores/auth-store';
import { useApi } from '@/composables/useApi';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'projectType-created': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);

const { error, execute: add } = useApi((create: IProjectTypeCreate) => projectTypeRepo.add(create));

const projectTypeName = ref('');
const projectTypeDescription = ref('');

const isFormValid = computed(() => {
  return projectTypeName.value.trim() !== '';
});

async function handleCreate() {
  if (!isFormValid.value) {
    return;
  }

  const newItem: IProjectTypeCreate = {
    projectTypeName: projectTypeName.value,
    projectTypeDescription: projectTypeDescription.value,
  };

  await add(newItem);

  if (error.value) {
    console.error('Failed to create projectType:', error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('projectType-created');
  resetForm();
}

function handleCancel() {
  emit('update:modelValue', false);
  resetForm();
}

function resetForm() {
  projectTypeName.value = '';
  projectTypeDescription.value = '';
}
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="addProjectTypeModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addProjectTypeModalLabel">Add New Project Type</h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label for="projectTypeName" class="form-label">Name *</label>
              <input
                type="text"
                class="form-control"
                id="projectTypeName"
                v-model="projectTypeName"
                required
              />
            </div>

            <div class="mb-3">
              <label for="projectTypeDescription" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="projectTypeDescription"
                v-model="projectTypeDescription"
              >
              </textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleCancel">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleCreate"
            :disabled="!isFormValid"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade" :class="{ show: modelValue }"></div>
</template>

<style scoped></style>
