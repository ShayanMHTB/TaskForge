<!-- web/src/App.vue -->

<template>
  <div id="app" class="min-h-screen">
    <!-- Loading screen -->
    <div
      v-if="isInitializing"
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      <div class="text-center">
        <div
          class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 animate-pulse"
        >
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">TaskForge</h2>
        <p class="text-gray-600 dark:text-gray-400">Loading your workspace...</p>
      </div>
    </div>

    <!-- Main router view -->
    <router-view v-else />

    <!-- Global notifications -->
    <Teleport to="body">
      <div
        v-if="notification"
        class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4 transform transition-all duration-300"
        :class="[notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0']"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Success icon -->
            <svg
              v-if="notification.type === 'success'"
              class="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Error icon -->
            <svg
              v-else-if="notification.type === 'error'"
              class="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Info icon -->
            <svg
              v-else
              class="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ notification.title }}
            </p>
            <p v-if="notification.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ notification.message }}
            </p>
          </div>

          <div class="ml-4 flex-shrink-0">
            <button
              @click="hideNotification"
              class="rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isInitializing = ref(true);

// Notification system
const notification = ref<{
  show: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
} | null>(null);

let notificationTimeout: NodeJS.Timeout | null = null;

function showNotification(type: 'success' | 'error' | 'info', title: string, message?: string) {
  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notification.value = {
    show: true,
    type,
    title,
    message,
  };

  // Auto hide after 5 seconds
  notificationTimeout = setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  if (notification.value) {
    notification.value.show = false;

    // Remove from DOM after animation
    setTimeout(() => {
      notification.value = null;
    }, 300);
  }

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}

// Global notification events
function handleNotification(event: CustomEvent) {
  const { type, title, message } = event.detail;
  showNotification(type, title, message);
}

function handleAuthUnauthorized() {
  authStore.$reset();
  showNotification('error', 'Session expired', 'Please log in again');
}

onMounted(async () => {
  // Initialize the app
  try {
    // Check if user is already authenticated
    if (!authStore.user) {
      try {
        await authStore.fetchUser();
      } catch {
        // User is not authenticated, that's fine
      }
    }
  } catch (error) {
    console.error('App initialization error:', error);
  } finally {
    isInitializing.value = false;
  }

  // Listen for global events
  window.addEventListener('notification', handleNotification as EventListener);
  window.addEventListener('auth:unauthorized', handleAuthUnauthorized);
});

onUnmounted(() => {
  // Cleanup
  window.removeEventListener('notification', handleNotification as EventListener);
  window.removeEventListener('auth:unauthorized', handleAuthUnauthorized);

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
});

// Global notification helper (can be used throughout the app)
window.showNotification = showNotification;
</script>

<style>
/* Global styles */
html {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>
