<script setup lang="ts">
import { TagRepository } from '@/repositories/TagRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';
import FormElement from '@/components/FormElement.vue';

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
  </AddModal>
</template>
