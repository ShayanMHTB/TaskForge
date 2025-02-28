<!-- web/src/views/NotFoundView.vue -->

<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center items-center px-4"
  >
    <div class="text-center">
      <!-- 404 Animation -->
      <div class="mb-8">
        <div class="relative">
          <div class="text-9xl font-bold text-gray-200 dark:text-gray-800 animate-pulse">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="h-16 w-16 text-blue-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Content -->
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you
        entered the wrong URL.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton @click="$router.go(-1)" variant="outline">
          <template #icon>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </template>
          Go Back
        </BaseButton>

        <BaseButton @click="$router.push('/dashboard')" variant="primary">
          <template #icon>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </template>
          Go Home
        </BaseButton>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">You might be looking for:</p>
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <router-link
            to="/dashboard"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Dashboard
          </router-link>
          <router-link
            to="/tasks"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            My Tasks
          </router-link>
          <router-link
            to="/today"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Today's Tasks
          </router-link>
          <router-link
            to="/upcoming"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            Upcoming Tasks
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
</script>
