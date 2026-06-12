<script setup lang="ts">
import type ITag from '@/domain/tag/ITag';
import { useAuthStore } from '@/stores/auth-store';
import { TagRepository } from '@/repositories/TagRepository';
import DeleteModal from '@/components/DeleteModal.vue';

const props = defineProps<{
  modelValue: boolean;
  tag: ITag | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'tag-deleted': [];
}>();

const authStore = useAuthStore();
const tagRepo = new TagRepository(authStore);
</script>

<template>
  <DeleteModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="Tag"
    :entity-name="tag?.tagName"
    :entity-id="tag?.id"
    :repository="tagRepo"
    @entity-deleted="emit('tag-deleted')"
  >
  </DeleteModal>
</template>
