<script setup lang="ts">
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import { useAuthStore } from '@/stores/auth-store';
import AddModal from '@/components/AddModal.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'author-role-created': [];
}>();

const authStore = useAuthStore();
const authorRoleRepo = new AuthorRoleRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'authorRoleName' in formData && formData.authorRoleName?.trim() !== '';
</script>

<template>
  <AddModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entityTypeName="AuthorRole"
    :repository="authorRoleRepo"
    :validate-form="validateForm"
    @entity-created="emit('author-role-created')"
  >
    <template #form-fields="{ updateData, formData }">
      <div class="mb-3">
        <label for="authorRoleName" class="form-label">Name *</label>
        <input
          type="text"
          class="form-control"
          id="authorRoleName"
          :value="formData.authorRoleName"
          @input="updateData('authorRoleName', ($event.target as HTMLInputElement).value)"
          required
        />
      </div>
    </template>
  </AddModal>
</template>
