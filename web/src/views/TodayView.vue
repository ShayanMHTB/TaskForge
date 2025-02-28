<!-- web/src/views/TodayView.vue -->

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ formatDate(new Date()) }} • {{ todayTasks.length }} tasks
          </p>
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

      <!-- Progress Card -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Today's Progress</h2>
          <div class="text-blue-100">{{ completedToday }}/{{ todayTasks.length }}</div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-blue-400 bg-opacity-30 rounded-full h-2 mb-4">
          <div
            class="bg-white rounded-full h-2 transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>

        <p class="text-blue-100">
          {{
            progressPercentage === 100
              ? "🎉 Amazing! You've completed all your tasks for today!"
              : `Keep going! ${todayTasks.length - completedToday} tasks remaining.`
          }}
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ completedToday }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ todayTasks.length - completedToday }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <svg
                class="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ highPriorityToday }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Sections -->
      <div class="space-y-6">
        <!-- Overdue Tasks -->
        <div v-if="overdueTasks.length > 0">
          <div class="flex items-center mb-4">
            <svg
              class="h-5 w-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">
              Overdue ({{ overdueTasks.length }})
            </h2>
          </div>
          <div class="space-y-2">
            <TaskCard
              v-for="task in overdueTasks"
              :key="`overdue-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
          </div>
        </div>

        <!-- Today's Tasks -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Tasks ({{ todayTasks.length }})
          </h2>

          <div v-if="todayTasks.length === 0" class="text-center py-8">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tasks for today
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enjoy your free time or add some tasks to stay productive!
            </p>
            <div class="mt-6">
              <BaseButton @click="showTaskModal = true" variant="primary">
                Add Task for Today
              </BaseButton>
            </div>
          </div>

          <div v-else class="space-y-2">
            <TaskCard
              v-for="task in todayTasks"
              :key="`today-${task.id}`"
              :task="task"
              @toggle="handleToggleTask"
              @edit="handleEditTask"
              @delete="handleDeleteTask"
            />
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

const todayTasks = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasksStore.tasks.filter((task) => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate < tomorrow;
  });
});

const overdueTasks = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasksStore.tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate < today;
  });
});

const completedToday = computed(() => todayTasks.value.filter((task) => task.completed).length);

const highPriorityToday = computed(
  () => todayTasks.value.filter((task) => task.priority === 'high' && !task.completed).length,
);

const progressPercentage = computed(() => {
  if (todayTasks.value.length === 0) return 0;
  return Math.round((completedToday.value / todayTasks.value.length) * 100);
});

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
