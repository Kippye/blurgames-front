<script setup lang="ts">
import type IGenre from '@/domain/genre/IGenre';
import type ITag from '@/domain/tag/ITag';
import type IProjectData from '@/types/IProjectData';
import type IProjectDetailsData from '@/types/IProjectDetailsData';
import { computed, ref, watch } from 'vue';
import FormElement from '../FormElement.vue';
import MultiselectSearchDropdown from '../MultiselectSearchDropdown.vue';

const project = defineModel<IProjectData>('project', { required: true });
const details = defineModel<IProjectDetailsData>('details', { required: true });

const props = defineProps<{
  genres: IGenre[];
  tags: ITag[];
  ogProjectData: IProjectData;
  ogDetailsData: IProjectDetailsData;
  error: string | null;
  isSaving: boolean;
}>();

const selectedGenreIds = ref<string[]>(details.value.projectGenres.map((pg) => pg.id));
const selectedTagIds = ref<string[]>(details.value.projectTags.map((pt) => pt.id));

const genresById = computed(() => {
  return new Map(props.genres.map((g) => [g.id, g]));
});
const tagsById = computed(() => {
  return new Map(props.tags.map((t) => [t.id, t]));
});

// We can't do newValue vs oldValue checking in these cus they are the same array reference
watch(
  selectedGenreIds,
  () => {
    details.value.projectGenres = selectedGenreIds.value.map(
      (selectedId) => genresById.value.get(selectedId)!,
    );
  },
  { deep: true },
);
watch(
  selectedTagIds,
  () => {
    details.value.projectTags = selectedTagIds.value.map(
      (selectedId) => tagsById.value.get(selectedId)!,
    );
  },
  { deep: true },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'edits-save': [];
  'edits-cancel': [];
}>();

const formErrors = computed(() => {
  const errs = [];
  const { projectDetails } = details.value;
  if (projectDetails.title.length == 0) {
    errs.push('Title is required');
  }
  if (projectDetails.title.length > 100) {
    errs.push('Title must be 100 characters or shorter');
  }
  if (projectDetails.shortDescription.length > 60) {
    errs.push('Short description must be 60 characters or shorter');
  }
  if (projectDetails.description.length > 60) {
    errs.push('Description must be 1000 characters or shorter');
  }
  return errs;
});

const haveMadeEdits = computed((): boolean => {
  // Just check details for now ugh
  let foundDiff = false;
  Object.entries(props.ogDetailsData.projectDetails).forEach(([key, val]) => {
    if (details.value.projectDetails[key as keyof typeof details.value.projectDetails] != val) {
      foundDiff = true;
      return;
    }
  });
  if (foundDiff) return foundDiff;

  for (
    let i = 0;
    i < Math.max(props.ogDetailsData.projectGenres.length, details.value.projectGenres.length);
    i++
  ) {
    if (props.ogDetailsData.projectGenres[i]?.id != details.value.projectGenres[i]?.id) {
      return true;
    }
  }
  for (
    let i = 0;
    i < Math.max(props.ogDetailsData.projectTags.length, details.value.projectTags.length);
    i++
  ) {
    if (props.ogDetailsData.projectTags[i]?.id != details.value.projectTags[i]?.id) {
      return true;
    }
  }
  return false;
});
</script>

<template>
  <div v-if="formErrors.length" class="alert alert-danger mt-3" role="alert">
    <ul class="mb-0">
      <li v-for="formError in formErrors" :key="formError">{{ formError }}</li>
    </ul>
  </div>
  <FormElement id="projectTitle" label="Title" maxlength="70" required>
    <template #default="{ form }">
      <input
        type="text"
        class="form-control"
        v-model="details.projectDetails.title"
        :id="form.id"
        :maxlength="form.maxlength"
        :required="form.required"
      />
    </template>
  </FormElement>
  <FormElement id="shortDescription" label="Short Description" maxlength="60">
    <template #default="{ form }">
      <input
        type="text"
        class="form-control"
        v-model="details.projectDetails.shortDescription"
        :id="form.id"
        :maxlength="form.maxlength"
        :required="form.required"
      />
    </template>
  </FormElement>
  <FormElement id="description" label="Description" maxlength="1000">
    <template #default="{ form }">
      <textarea
        class="form-control"
        v-model="details.projectDetails.description"
        :id="form.id"
        :maxlength="form.id"
        :required="form.required"
      >
      </textarea>
    </template>
  </FormElement>
  <FormElement id="genres" label="Genres">
    <MultiselectSearchDropdown
      :items="genres"
      v-model="selectedGenreIds"
      name-property="genreName"
      description-property="genreDescription"
      item-class="badge bg-success"
    >
    </MultiselectSearchDropdown>
  </FormElement>
  <FormElement id="tags" label="Tags">
    <MultiselectSearchDropdown
      :items="tags"
      v-model="selectedTagIds"
      name-property="tagName"
      description-property="tagDescription"
    >
    </MultiselectSearchDropdown>
  </FormElement>
  <div v-if="error" class="alert alert-danger mt-3" role="alert">
    {{ error }}
  </div>
  <div class="footer row justify-content-center">
    <button
      type="button"
      class="btn btn-primary col-auto me-4"
      @click="emit('edits-save')"
      :disabled="!haveMadeEdits || formErrors.length > 0 || isSaving"
    >
      <span
        v-if="isSaving"
        class="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
    <button class="btn btn-warning col-auto" @click="emit('edits-cancel')">Cancel</button>
  </div>
</template>
