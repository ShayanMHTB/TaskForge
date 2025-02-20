<!-- web/src/components/layout/DashboardLayout.vue -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="[sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'lg:translate-x-0']"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center space-x-3">
          <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">TaskForge</span>
        </div>

        <!-- Close button (mobile) -->
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          :class="[
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            $route.path === item.to
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
          {{ item.name }}
          <span
            v-if="item.badge"
            class="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Task Lists Section -->
      <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <h3
            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Lists
          </h3>
          <button
            @click="showCreateListModal = true"
            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-1 max-h-48 overflow-y-auto">
          <router-link
            v-for="list in tasksStore.taskLists"
            :key="list.id"
            :to="`/lists/${list.id}`"
            class="group flex items-center px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div
              class="h-3 w-3 rounded-full mr-3 flex-shrink-0"
              :style="{ backgroundColor: list.color }"
            ></div>
            <span class="text-gray-700 dark:text-gray-300 truncate">{{ list.name }}</span>
            <span v-if="list.tasks_count" class="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {{ list.tasks_count }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- User Menu -->
      <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div
            class="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ userInitials }}
            </span>
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.userName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.userEmail }}
            </p>
          </div>
          <button
            @click="handleLogout"
            class="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Sign out"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top header -->
      <header
        class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          <!-- Mobile menu button -->
          <button
            @click="sidebarOpen = true"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Page title -->
          <div class="flex-1">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
          </div>

          <!-- Header actions -->
          <div class="flex items-center space-x-4">
            <!-- Quick add task button -->
            <BaseButton @click="showCreateTaskModal = true" variant="primary" size="sm">
              <template #icon>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </template>
              Add Task
            </BaseButton>

            <!-- Theme toggle -->
            <button
              @click="toggleTheme"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                v-if="isDark"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <!-- Modals -->
    <!-- Create Task Modal -->
    <!-- Create List Modal -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import BaseButton from '@/components/ui/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const tasksStore = useTasksStore();

const sidebarOpen = ref(false);
const showCreateTaskModal = ref(false);
const showCreateListModal = ref(false);
const isDark = ref(false);

const navigation = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'HomeIcon',
    badge: null,
  },
  {
    name: 'My Tasks',
    to: '/tasks',
    icon: 'CheckCircleIcon',
    badge: tasksStore.pendingTasks.length,
  },
  {
    name: 'Today',
    to: '/today',
    icon: 'CalendarIcon',
    badge: null,
  },
  {
    name: 'Upcoming',
    to: '/upcoming',
    icon: 'ClockIcon',
    badge: tasksStore.overdueTasks.length,
  },
];

const pageTitle = computed(() => {
  const routeMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/tasks': 'My Tasks',
    '/today': 'Today',
    '/upcoming': 'Upcoming',
  };
  return routeMap[route.path] || 'TaskForge';
});

const userInitials = computed(() => {
  const name = authStore.userName;
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

async function handleLogout() {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

onMounted(async () => {
  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  document.documentElement.classList.toggle('dark', isDark.value);

  // Load task lists
  try {
    await tasksStore.fetchTaskLists();
  } catch (error) {
    console.error('Failed to load task lists:', error);
  }
});
</script>
