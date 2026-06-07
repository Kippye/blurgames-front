<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth-store';

const authStore = useAuthStore();
const { getAuthInfo, isLoggedIn } = authStore;

function logOut() {
  authStore.logOut();
  if (!isLoggedIn()) {
    router.push({ name: 'Login' });
  }
}
</script>

<template>
  <nav v-if="isLoggedIn()" class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Blurgames</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#headerNavbarCollapse"
        aria-controls="headerNavbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="headerNavbarCollapse">
        <ul class="navbar-nav me-auto mb-md-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-md-auto mb-2 mb-md-0">
          <li class="nav-item">
            <span class="nav-link">{{ getAuthInfo()?.userName }}</span>
          </li>
          <li class="nav-item">
            <span class="nav-link text-light">({{ getAuthInfo()?.email }})</span>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" @click="logOut">Log out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
