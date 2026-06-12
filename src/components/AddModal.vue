<script setup lang="ts" generic="TEntity, TCreate">
import { ref, computed } from 'vue';
import type { IResultObject } from '@/types/IResultObject';
import { useApi } from '@/composables/useApi';
import { toSeparateWords } from '@/util/string-helpers';

interface IAddModalProps<TEntity, TCreate> {
  modelValue: boolean;
  entityTypeName: string;
  repository: {
    add: (create: TCreate) => Promise<IResultObject<TEntity>>;
  };
  validateForm: (formData: Record<string, string>) => boolean;
}

const props = defineProps<IAddModalProps<TEntity, TCreate>>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'entity-created': [];
}>();

const {
  error,
  execute: add,
  clear: clearApiResult,
} = useApi<TEntity, [TCreate]>((create: TCreate) => props.repository.add(create));

const formData = ref<Record<string, string>>({});

const isFormValid = computed(() => {
  return props.validateForm(formData.value);
});

async function handleCreate() {
  if (!isFormValid.value) {
    return;
  }

  await add(formData.value as TCreate);

  if (error.value) {
    console.error(`Failed to create ${props.entityTypeName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('entity-created');
  resetForm();
}

function handleCancel() {
  emit('update:modelValue', false);
  resetForm();
}

function resetForm() {
  formData.value = {};
  clearApiResult();
}

function updateFormData(key: string, value: string) {
  formData.value[key] = value;
}
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="addEntityModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addEntityModalLabel">
            Add New {{ toSeparateWords(entityTypeName) }}
          </h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreate">
            <slot name="form-fields" :update-data="updateFormData" :form-data="formData"></slot>
          </form>
          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>
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
