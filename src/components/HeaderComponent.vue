<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import NavItem from './NavItem.vue';

const authStore = useAuthStore();
const { getAuthInfo, isLoggedIn, getUserType } = authStore;

function logOut() {
  authStore.logOut();
  if (!isLoggedIn()) {
    router.push({ name: 'Login' });
  }
}
</script>

<template>
  <nav v-if="isLoggedIn()" class="navbar navbar-expand-md navbar-dark fixed-top">
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
        <ul class="navbar-nav me mb-md-0">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/projects">Projects</NavItem>
          <NavItem to="/upload">Upload</NavItem>
        </ul>
        <ul class="navbar-nav ms-md-auto mb-2 mb-md-0">
          <li v-if="getUserType() == 'admin'" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/author-roles" class="dropdown-item"> Author Roles </RouterLink>
              </li>
              <li>
                <RouterLink to="/genres" class="dropdown-item"> Genres </RouterLink>
              </li>
              <li>
                <RouterLink to="/project-types" class="dropdown-item"> Project Types </RouterLink>
              </li>
              <li>
                <RouterLink to="/tags" class="dropdown-item"> Tags </RouterLink>
              </li>
            </ul>
          </li>
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

<style scoped>
.navbar {
  background-color: #a6c5e1;
}

.nav-link {
  --bs-nav-link-color: rgba(10, 10, 10, 0.75);
}
</style>
