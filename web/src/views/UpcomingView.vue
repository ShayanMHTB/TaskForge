<!-- web/src/views/UpcomingView.vue -->

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h1>
          <p class="text-gray-600 dark:text-gray-400">Your tasks for the next 30 days</p>
        </div>
        <BaseButton @click="showTaskModal = true" variant="primary">
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
      </div>

      <!-- Quick Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tomorrow</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ tomorrowTasks.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ thisWeekTasks.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Next Week</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ nextWeekTasks.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Later</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ laterTasks.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Timeline -->
      <div class="space-y-8">
        <!-- Tomorrow -->
        <div v-if="tomorrowTasks.length > 0">
          <div class="flex items-center mb-4">
            <div class="flex items-center">
              <div class="h-3 w-3 bg-blue-500 rounded-full mr-3"></div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Tomorrow</h2>
              <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(tomorrow) }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskCard
              v-for="task in tomorrowTasks"
              :key="`tomorrow-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>

        <!-- This Week -->
        <div v-if="thisWeekTasksFiltered.length > 0">
          <div class="flex items-center mb-4">
            <div class="flex items-center">
              <div class="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">This Week</h2>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskCard
              v-for="task in thisWeekTasksFiltered"
              :key="`week-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>

        <!-- Next Week -->
        <div v-if="nextWeekTasks.length > 0">
          <div class="flex items-center mb-4">
            <div class="flex items-center">
              <div class="h-3 w-3 bg-purple-500 rounded-full mr-3"></div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Next Week</h2>
              <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateRange(nextWeekStart, nextWeekEnd) }}
              </span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskCard
              v-for="task in nextWeekTasks"
              :key="`next-week-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>

        <!-- Later -->
        <div v-if="laterTasks.length > 0">
          <div class="flex items-center mb-4">
            <div class="flex items-center">
              <div class="h-3 w-3 bg-orange-500 rounded-full mr-3"></div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Later</h2>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskCard
              v-for="task in laterTasks"
              :key="`later-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>

        <!-- No Upcoming Tasks -->
        <div v-if="allUpcomingTasks.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming tasks</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You're all caught up! Consider planning some future tasks.
          </p>
          <div class="mt-6">
            <BaseButton @click="showTaskModal = true" variant="primary">
              Schedule a Task
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      :show="showTaskModal"
      :editing-task="editingTask"
      @close="closeTaskModal"
      @success="handleTaskSuccess"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import TaskCard from '@/components/tasks/TaskCard.vue';
import TaskFormModal from '@/components/tasks/TaskFormModal.vue';
import type { Task } from '@/types/api';

const tasksStore = useTasksStore();

const showTaskModal = ref(false);
const editingTask = ref<Task | null>(null);

// Date calculations
const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const endOfWeek = new Date(today);
endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

const nextWeekStart = new Date(endOfWeek);
nextWeekStart.setDate(endOfWeek.getDate() + 1);

const nextWeekEnd = new Date(nextWeekStart);
nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

const nextWeekEndTime = new Date(nextWeekEnd);
nextWeekEndTime.setHours(23, 59, 59, 999);

// Task filters
const tomorrowTasks = computed(() => {
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  return tasksStore.tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= tomorrow && dueDate <= tomorrowEnd;
  });
});

const thisWeekTasks = computed(() => {
  return tasksStore.tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate > tomorrow && dueDate <= endOfWeek;
  });
});

const thisWeekTasksFiltered = computed(() => {
  // Exclude tomorrow's tasks from this week section
  return thisWeekTasks.value;
});

const nextWeekTasks = computed(() => {
  return tasksStore.tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= nextWeekStart && dueDate <= nextWeekEndTime;
  });
});

const laterTasks = computed(() => {
  return tasksStore.tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate > nextWeekEndTime;
  });
});

const allUpcomingTasks = computed(() => [
  ...tomorrowTasks.value,
  ...thisWeekTasksFiltered.value,
  ...nextWeekTasks.value,
  ...laterTasks.value,
]);

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateRange(start: Date, end: Date) {
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${startStr} - ${endStr}`;
}

async function handleToggleTask(taskId: number) {
  try {
    await tasksStore.toggleTask(taskId);
  } catch (error) {
    window.showNotification('error', 'Failed to update task');
  }
}

function handleEditTask(task: Task) {
  editingTask.value = task;
  showTaskModal.value = true;
}

async function handleDeleteTask(taskId: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await tasksStore.deleteTask(taskId);
      window.showNotification('success', 'Task deleted successfully');
    } catch (error) {
      window.showNotification('error', 'Failed to delete task');
    }
  }
}

function closeTaskModal() {
  showTaskModal.value = false;
  editingTask.value = null;
}

function handleTaskSuccess() {
  closeTaskModal();
}

onMounted(async () => {
  try {
    await tasksStore.fetchTasks({
      include: 'list,tags',
    });
  } catch (error) {
    window.showNotification('error', 'Failed to load tasks');
  }
});
</script>
