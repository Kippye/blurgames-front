<script setup lang="ts">
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';

const props = defineProps<{
  modelValue: boolean;
  authorRole: IAuthorRole | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'author-role-updated': [];
}>();

const authStore = useAuthStore();
const authorRoleRepo = new AuthorRoleRepository(authStore);

const validateForm = (formData: Record<string, string>) =>
  'authorRoleName' in formData && formData.authorRoleName?.trim() !== '';
</script>

<template>
  <EditModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="AuthorRole"
    :entity="authorRole"
    :repository="authorRoleRepo"
    :validate-form="validateForm"
    @entity-updated="emit('author-role-updated')"
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
  </EditModal>
</template>

<style scoped></style>
