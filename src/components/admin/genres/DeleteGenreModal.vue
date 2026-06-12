<script setup lang="ts">
import type IGenre from '@/domain/genre/IGenre';
import { useAuthStore } from '@/stores/auth-store';
import { GenreRepository } from '@/repositories/GenreRepository';
import DeleteModal from '@/components/DeleteModal.vue';

const props = defineProps<{
  modelValue: boolean;
  genre: IGenre | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'genre-deleted': [];
}>();

const authStore = useAuthStore();
const genreRepo = new GenreRepository(authStore);
</script>

<template>
  <DeleteModal
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    entity-type-name="Genre"
    :entity-name="genre?.genreName"
    :entity-id="genre?.id"
    :repository="genreRepo"
    @entity-deleted="emit('genre-deleted')"
  >
  </DeleteModal>
</template>
