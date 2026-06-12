<script setup lang="ts" generic="TEntity">
import { watch } from 'vue';
import { useApi } from '@/composables/useApi';
import { toSeparateWords } from '@/util/string-helpers';
import type { IResultObject } from '@/types/IResultObject';

interface IDeleteModalProps<TEntity> {
  modelValue: boolean;
  entityTypeName: string;
  entityName?: string;
  entityId?: string;
  repository: {
    delete: (id: string) => Promise<IResultObject<TEntity>>;
  };
}

const props = defineProps<IDeleteModalProps<TEntity>>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'entity-deleted': [];
}>();

const {
  error,
  execute: executeDelete,
  clear: clearApiResult,
} = useApi((id: string) => props.repository.delete(id));

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      clearApiResult();
    }
  },
);

async function handleDelete() {
  await executeDelete(props.entityId!);

  if (error.value) {
    console.error(`Failed to delete ${props.entityTypeName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('entity-deleted');
  clearApiResult();
}

function handleCancel() {
  emit('update:modelValue', false);
  clearApiResult();
}
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="deleteEntityModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteEntityModalLabel">
            Delete {{ toSeparateWords(entityTypeName) }}
          </h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete the
            {{
              toSeparateWords(entityTypeName).toLowerCase() +
              (entityName !== undefined ? ` "${entityName}"` : '')
            }}?
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
