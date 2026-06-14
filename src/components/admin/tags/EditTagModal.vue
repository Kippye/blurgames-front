<script setup lang="ts">
import type ITag from '@/domain/tag/ITag';
import { TagRepository } from '@/repositories/TagRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';
import FormElement from '@/components/FormElement.vue';

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
      <FormElement id="tagName" label="Name" required>
        <template #default="{ form }">
          <input
            type="text"
            class="form-control"
            :id="form.id"
            :value="formData.tagName"
            @input="updateData('tagName', ($event.target as HTMLInputElement).value)"
            :required="form.required"
          />
        </template>
      </FormElement>

      <FormElement id="tagDescription" label="Description">
        <template #default="{ form }">
          <textarea
            class="form-control"
            :id="form.id"
            :value="formData.tagDescription"
            @input="updateData('tagDescription', ($event.target as HTMLTextAreaElement).value)"
            :required="form.required"
          >
          </textarea>
        </template>
      </FormElement>
    </template>
  </EditModal>
</template>

<style scoped></style>
