import { useAuthStore } from '@/stores/auth-store';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import MainView from '@/views/MainView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import GenreView from '@/views/admin/GenreView.vue';
import ProjectTypeView from '@/views/admin/ProjectTypeView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: MainView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  // ADMIN ROUTES
  {
    path: '/genres',
    name: 'Genres',
    component: GenreView,
    meta: { requiresAuth: true, userType: 'admin' },
  },
  {
    path: '/project-types',
    name: 'ProjectTypes',
    component: ProjectTypeView,
    meta: { requiresAuth: true, userType: 'admin' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  const nonProtectedRoutes = ['Login', 'Register'];

  if (!nonProtectedRoutes.includes(to.name as string) && !authStore.isLoggedIn()) {
    return { name: 'Login' };
  }

  const userType = authStore.getUserType();

  if (to.meta.requiresAuth && to.meta.userType) {
    const requiredUserType = to.meta.userType as string;

    if (userType !== requiredUserType) {
      return { name: 'Home' };
    }
  }
});

export default router;
