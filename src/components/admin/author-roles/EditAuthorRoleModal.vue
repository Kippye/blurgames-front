<script setup lang="ts">
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import { useAuthStore } from '@/stores/auth-store';
import EditModal from '@/components/EditModal.vue';
import FormElement from '@/components/FormElement.vue';

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
      <FormElement id="authorRoleName" label="Name" required>
        <template #default="{ form }">
          <input
            type="text"
            class="form-control"
            :id="form.id"
            :value="formData.authorRoleName"
            @input="updateData('authorRoleName', ($event.target as HTMLInputElement).value)"
            :required="form.required"
          />
        </template>
      </FormElement>
    </template>
  </EditModal>
</template>

<style scoped></style>
