<script setup lang="ts">
import { TagRepository } from '@/repositories/TagRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'tag-created': [];
}>();

const authStore = useAuthStore();
const tagRepo = new TagRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'tagName' in formData && formData.tagName?.trim() !== '';
</script>

<template>
  <AddModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entityTypeName="Tag"
    :repository="tagRepo"
    :validate-form="validateForm"
    @entity-created="emit('tag-created')"
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
  </AddModal>
</template>
