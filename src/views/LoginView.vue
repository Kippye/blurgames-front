<script setup lang="ts">
import router from '@/router';
import { LoginService } from '@/services/LoginService';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth-store';

const loginService = new LoginService();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const message = ref('');

async function login() {
  if (authStore.isLoggedIn()) {
    return;
  }

  const res = await loginService.login({
    email: email.value,
    password: password.value,
  });

  if (res.errors) {
    message.value = res.errors.join(', ');
    return;
  }

  if (res.data) {
    await authStore.setAuthInfo({
      ...res.data,
      systemRoles: res.data.roles,
    });
    router.push({ name: 'Home' });
  }
}

onMounted(() => {
  // Already logged-in users go to home page
  if (authStore.isLoggedIn()) {
    router.push({ name: 'Home' });
  }
});
</script>

<template>
  <div class="text-center">
    <div class="alert alert-danger" role="alert" v-if="message">
      {{ message }}
    </div>
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="login">
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
        <div class="form-floating">
          <input type="email" class="form-control" id="email" placeholder="" v-model="email" />
          <label for="email">Email</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder=""
            v-model="password"
          />
          <label for="password">Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      </form>
      No account yet? <RouterLink to="/register" class="nav-link">Register</RouterLink>
    </main>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
}

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
