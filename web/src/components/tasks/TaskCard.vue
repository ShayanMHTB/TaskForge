<!-- web/src/components/tasks/TaskCard.vue -->

<template>
  <div
    class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
    :class="[
      task.completed ? 'opacity-75' : '',
      isOverdue ? 'border-red-200 dark:border-red-800' : '',
    ]"
  >
    <!-- Task Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-start space-x-3 flex-1">
        <!-- Checkbox -->
        <button
          @click="$emit('toggle', task.id)"
          class="mt-0.5 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div
            class="h-5 w-5 rounded border-2 transition-all duration-200 flex items-center justify-center"
            :class="[
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400',
            ]"
          >
            <svg
              v-if="task.completed"
              class="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </button>

        <!-- Task Content -->
        <div class="flex-1 min-w-0">
          <!-- Title -->
          <h3
            class="text-sm font-medium text-gray-900 dark:text-white mb-1 transition-colors"
            :class="[task.completed ? 'line-through text-gray-500 dark:text-gray-400' : '']"
          >
            {{ task.title }}
          </h3>

          <!-- Description -->
          <p
            v-if="task.description"
            class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
            :class="[task.completed ? 'line-through' : '']"
          >
            {{ task.description }}
          </p>

          <!-- Tags -->
          <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="tag in task.tags"
              :key="tag.id"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :style="{
                backgroundColor: tag.color + '20',
                color: tag.color,
              }"
            >
              {{ tag.name }}
            </span>
          </div>

          <!-- Task List -->
          <div v-if="task.task_list" class="flex items-center mb-2">
            <div
              class="h-2 w-2 rounded-full mr-2"
              :style="{ backgroundColor: task.task_list.color }"
            ></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ task.task_list.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Priority Indicator -->
      <div v-if="task.priority !== 'medium'" class="flex-shrink-0 ml-2">
        <div
          class="h-2 w-2 rounded-full"
          :class="[
            task.priority === 'high' ? 'bg-red-500' : task.priority === 'low' ? 'bg-gray-400' : '',
          ]"
        ></div>
      </div>
    </div>

    <!-- Task Footer -->
    <div class="flex items-center justify-between">
      <!-- Due Date -->
      <div v-if="task.due_date" class="flex items-center text-xs">
        <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span
          :class="[
            isOverdue && !task.completed
              ? 'text-red-600 dark:text-red-400 font-medium'
              : 'text-gray-500 dark:text-gray-400',
          ]"
        >
          {{ formatDueDate(task.due_date) }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <!-- Edit Button -->
        <button
          @click="$emit('edit', task)"
          class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
          title="Edit task"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <!-- Delete Button -->
        <button
          @click="$emit('delete', task.id)"
          class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
          title="Delete task"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <!-- More Options -->
        <button
          @click="showOptions = !showOptions"
          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors relative"
          title="More options"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>

          <!-- Options Dropdown -->
          <div
            v-if="showOptions"
            class="absolute right-0 top-6 mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10"
            @click.stop
          >
            <button
              @click="
                $emit('duplicate', task);
                showOptions = false;
              "
              class="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Duplicate
            </button>
            <button
              @click="
                $emit('move', task);
                showOptions = false;
              "
              class="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Move to List
            </button>
            <button
              @click="
                $emit('archive', task.id);
                showOptions = false;
              "
              class="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Archive
            </button>
          </div>
        </button>
      </div>
    </div>

    <!-- Click outside to close options -->
    <div v-if="showOptions" class="fixed inset-0 z-0" @click="showOptions = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task } from '@/types/api';

interface Props {
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggle: [taskId: number];
  edit: [task: Task];
  delete: [taskId: number];
  duplicate: [task: Task];
  move: [task: Task];
  archive: [taskId: number];
}>();

const showOptions = ref(false);

const isOverdue = computed(() => {
  if (!props.task.due_date || props.task.completed) return false;
  return new Date(props.task.due_date) < new Date();
});

function formatDueDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays < 7) return `in ${diffDays} days`;

  return date.toLocaleDateString();
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
