<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue';
</script>

<!-- App.vue should be very clean and minimal, mostly defining routes and components -->
<template>
  <HeaderComponent />
  <div class="container">
    <main class="bg-body-tertiary p-5 rounded">
      <RouterView />
    </main>
  </div>
</template>

<style module.>
@import '../public/site.css';
</style>
