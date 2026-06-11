<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type IProjectType from '@/domain/projectType/IProjectType';
import { ProjectTypeRepository } from '@/repositories/ProjectTypeRepository';
import { useAuthStore } from '@/stores/auth-store';
import { useApi } from '@/composables/useApi';
import { toSeparateWords } from '@/util/string-helpers';

const props = defineProps<{
  modelValue: boolean;
  entityName: string;
  projectType: IProjectType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'projectType-updated': [];
}>();

const authStore = useAuthStore();
const projectTypeRepo = new ProjectTypeRepository(authStore);

const { error, execute: update } = useApi((update: IProjectType) =>
  projectTypeRepo.update(update.id, update),
);

const projectTypeName = ref('');
const projectTypeDescription = ref('');

const isFormValid = computed(() => {
  return (
    projectTypeName.value != null &&
    projectTypeName.value.trim() !== '' &&
    projectTypeDescription.value != null
  );
});

async function handleUpdate() {
  if (!isFormValid.value) {
    return;
  }

  const newItem: IProjectType = {
    id: props.projectType!.id,
    projectTypeName: projectTypeName.value,
    projectTypeDescription: projectTypeDescription.value,
  };

  await update(newItem);

  if (error.value) {
    console.error(`Failed to update ${props.entityName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('projectType-updated');
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

function populateForm(projectType: IProjectType) {
  projectTypeName.value = projectType.projectTypeName;
  projectTypeDescription.value = projectType.projectTypeDescription;
}

watch(
  () => props.projectType,
  (newProjectType) => {
    if (newProjectType) {
      populateForm(newProjectType);
    }
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.projectType) {
      populateForm(props.projectType);
    }
  },
);
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="editProjectTypeModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editProjectTypeModalLabel">
            Edit {{ toSeparateWords(entityName) }}
          </h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdate">
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
            @click="handleUpdate"
            :disabled="!isFormValid"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="modelValue" class="modal-backdrop fade" :class="{ show: modelValue }"></div>
</template>

<style scoped></style>
