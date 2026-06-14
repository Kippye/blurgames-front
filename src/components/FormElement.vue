<script setup lang="ts">
const props = defineProps<{
  id: string;
  label: string;
  required?: boolean;
}>();
console.log(props.label, props.required ?? 'undefined');
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ `${label}${required ? ' *' : ''}` }}</label>
    <slot></slot>
  </div>
</template>
