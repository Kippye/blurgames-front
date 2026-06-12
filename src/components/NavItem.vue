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

<style scoped>
.nav-link {
  --bs-nav-link-color: rgba(10, 10, 10, 0.75);
}
</style>
