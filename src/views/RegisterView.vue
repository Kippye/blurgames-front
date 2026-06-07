<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { RegisterService } from '@/services/RegisterService';
import { onMounted, ref } from 'vue';

const registerService = new RegisterService();
const authStore = useAuthStore();

const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const message = ref('');

async function register() {
  if (password.value !== passwordConfirm.value) {
    message.value = 'Passwords must match!';
    return;
  }

  const res = await registerService.register({
    userName: userName.value,
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
  // if (authStore.isLoggedIn()) {
  //   router.push({ name: 'Home' });
  // }
});
</script>

<template>
  <div class="text-center">
    <div class="alert alert-danger" role="alert" v-if="message">
      {{ message }}
    </div>
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="register">
        <h1 class="h3 mb-3 fw-normal">Register</h1>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="userName"
            placeholder=""
            required
            v-model="userName"
          />
          <label for="userName">Username</label>
        </div>

        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder=""
            required
            v-model="email"
          />
          <label for="email">Email</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder=""
            required
            v-model="password"
          />
          <label for="password">Password</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="passwordConfirm"
            placeholder=""
            required
            v-model="passwordConfirm"
          />
          <label for="passwordConfirm">Confirm Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Register</button>
      </form>
      <hr />
      Already have an account? <RouterLink to="/login" class="nav-link">Log In</RouterLink>
      <hr />
    </main>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
}

.form-signin {
  max-width: 380px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input {
  border-radius: 0;
  margin-bottom: -1px;
}

.form-signin input#firstName {
  border-top-left-radius: var(--bs-border-radius);
  border-top-right-radius: var(--bs-border-radius);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input#passwordConfirm {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--bs-border-radius);
  border-bottom-right-radius: var(--bs-border-radius);
}
</style>
