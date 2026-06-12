<script setup lang="ts" generic="TEntity extends IBaseEntity, TUpdate extends IBaseEntity">
import { computed, ref, watch } from 'vue';
import { useApi } from '@/composables/useApi';
import type { IResultObject } from '@/types/IResultObject';
import type { IBaseEntity } from '@/domain/IBaseEntity';
import { toSeparateWords } from '@/util/string-helpers';

interface IEditModalProps<TEntity, TUpdate> {
  modelValue: boolean;
  entityTypeName: string;
  entity: TEntity | null;
  repository: {
    update: (item: TUpdate) => Promise<IResultObject<TEntity>>;
  };
  validateForm: (formData: Record<string, string>) => boolean;
}

const props = defineProps<IEditModalProps<TEntity, TUpdate>>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'entity-updated': [];
}>();

const {
  error,
  execute: update,
  clear: clearApiResult,
} = useApi<TEntity, [TUpdate]>((item: TUpdate) => props.repository.update(item));

const formData = ref<Record<string, string>>({});

const isFormValid = computed(() => {
  return props.validateForm(formData.value);
});

async function handleUpdate() {
  if (!isFormValid.value) {
    return;
  }

  await update({ id: props.entity!.id, ...formData.value } as TUpdate);

  if (error.value) {
    console.error(`Failed to update ${props.entityTypeName}:`, error.value);
    return;
  }

  emit('update:modelValue', false);
  emit('entity-updated');
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

function populateForm(entity: TEntity) {
  resetForm();
  formData.value = Object(entity);
}

watch(
  () => props.entity,
  (newEntity) => {
    if (newEntity) {
      populateForm(newEntity);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="editEntityModalLabel"
    :aria-hidden="!modelValue"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editGenreModalLabel">
            Edit {{ toSeparateWords(entityTypeName) }}
          </h5>
          <button type="button" class="btn-close" @click="handleCancel" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdate">
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
