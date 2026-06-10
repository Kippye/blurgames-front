<script setup lang="ts">
defineProps<{
  to: string;
}>();
</script>

<template>
  <li class="nav-item">
    <RouterLink :to="to" class="nav-link">
      <slot> Nav </slot>
    </RouterLink>
  </li>
</template>
