// web/src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('@/views/TasksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/today',
      name: 'Today',
      component: () => import('@/views/TodayView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/upcoming',
      name: 'Upcoming',
      component: () => import('@/views/UpcomingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/lists/:id',
      name: 'TaskList',
      component: () => import('@/views/TasklistView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Try to fetch user if authenticated but no user data
  if (!authStore.user && !authStore.isLoading) {
    try {
      await authStore.fetchUser();
    } catch {
      // User is not authenticated, clear any stale data
      authStore.$reset();
    }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if authentication required
    next('/login');
  } else if (requiresGuest && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
