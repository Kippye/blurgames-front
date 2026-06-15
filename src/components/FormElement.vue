<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  maxlength?: string;
  required?: boolean;
}>();
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="maxlength" class="text-muted">({{ maxlength }})</span>
      <span v-if="required" class="text-primary">*</span></label
    >
    <slot :form="{ id, required, maxlength }"></slot>
  </div>
</template>
