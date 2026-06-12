<script setup lang="ts">
import type ITag from '@/domain/tag/ITag';
import { TagRepository } from '@/repositories/TagRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';

const props = defineProps<{
  modelValue: boolean;
  tag: ITag | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'tag-updated': [];
}>();

const authStore = useAuthStore();
const tagRepo = new TagRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'tagName' in formData && formData.tagName?.trim() !== '' && 'tagDescription' in formData;
</script>

<template>
  <EditModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="Tag"
    :entity="tag"
    :repository="tagRepo"
    :validate-form="validateForm"
    @entity-updated="emit('tag-updated')"
  >
    <template #form-fields="{ updateData, formData }">
      <div class="mb-3">
        <label for="tagName" class="form-label">Name *</label>
        <input
          type="text"
          class="form-control"
          id="tagName"
          :value="formData.tagName"
          @input="updateData('tagName', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>

      <div class="mb-3">
        <label for="tagDescription" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="tagDescription"
          :value="formData.tagDescription"
          @input="updateData('tagDescription', ($event.target as HTMLTextAreaElement).value)"
        >
        </textarea>
      </div>
    </template>
  </EditModal>
</template>

<style scoped></style>
