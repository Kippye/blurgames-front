<script setup lang="ts">
import type IAuthorRole from '@/domain/authorRole/IAuthorRole';
import { useAuthStore } from '@/stores/auth-store';
import { AuthorRoleRepository } from '@/repositories/AuthorRoleRepository';
import DeleteModal from '@/components/DeleteModal.vue';

const props = defineProps<{
  modelValue: boolean;
  authorRole: IAuthorRole | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'author-role-deleted': [];
}>();

const authStore = useAuthStore();
const authorRoleRepo = new AuthorRoleRepository(authStore);
</script>

<template>
  <DeleteModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="AuthorRole"
    :entity-name="authorRole?.authorRoleName"
    :entity-id="authorRole?.id"
    :repository="authorRoleRepo"
    @entity-deleted="emit('author-role-deleted')"
  >
  </DeleteModal>
</template>
