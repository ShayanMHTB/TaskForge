<!-- web/src/views/TasksView.vue -->

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ filteredTasks.length }} tasks • {{ completedCount }} completed
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <!-- View Toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              @click="viewMode = 'list'"
              class="flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              :class="[
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
            >
              <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              List
            </button>
            <button
              @click="viewMode = 'grid'"
              class="flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              :class="[
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
            >
              <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Grid
            </button>
          </div>

          <!-- Add Task Button -->
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
      </div>

      <!-- Filters Section -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-64">
            <BaseInput v-model="searchQuery" placeholder="Search tasks..." clearable>
              <template #leading>
                <svg
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </template>
            </BaseInput>
          </div>

          <!-- Filter by List -->
          <select
            v-model="selectedList"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">All Lists</option>
            <option v-for="list in tasksStore.taskLists" :key="list.id" :value="list.id">
              {{ list.name }}
            </option>
          </select>

          <!-- Filter by Priority -->
          <select
            v-model="selectedPriority"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <!-- Filter by Status -->
          <select
            v-model="selectedStatus"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <!-- Tasks Content -->
      <div v-if="tasksStore.isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
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
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{
            searchQuery || selectedList || selectedPriority || selectedStatus
              ? 'Try adjusting your filters'
              : 'Get started by creating your first task.'
          }}
        </p>
        <div class="mt-6">
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
            Create Task
          </BaseButton>
        </div>
      </div>

      <!-- Tasks List/Grid -->
      <div v-else>
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="space-y-2">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @toggle="handleToggleTask"
            @edit="handleEditTask"
            @delete="handleDeleteTask"
            @duplicate="handleDuplicateTask"
            @move="handleMoveTask"
            @archive="handleArchiveTask"
          />
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @toggle="handleToggleTask"
            @edit="handleEditTask"
            @delete="handleDeleteTask"
            @duplicate="handleDuplicateTask"
            @move="handleMoveTask"
            @archive="handleArchiveTask"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreTasks" class="flex justify-center pt-6">
          <BaseButton @click="loadMoreTasks" variant="outline" :loading="isLoadingMore">
            Load More Tasks
          </BaseButton>
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

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import TaskCard from '@/components/tasks/TaskCard.vue';
import TaskFormModal from '@/components/tasks/TaskFormModal.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import type { Task } from '@/types/api';

const tasksStore = useTasksStore();

// View state
const viewMode = ref<'list' | 'grid'>('list');
const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const editingTask = ref<Task | null>(null);
const deletingTaskId = ref<number | null>(null);
const isLoadingMore = ref(false);

// Filters
const searchQuery = ref('');
const selectedList = ref<number | ''>('');
const selectedPriority = ref<'high' | 'medium' | 'low' | ''>('');
const selectedStatus = ref<'pending' | 'completed' | 'overdue' | ''>('');

// Computed
const filteredTasks = computed(() => {
  let tasks = [...tasksStore.tasks];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query),
    );
  }

  // List filter
  if (selectedList.value) {
    tasks = tasks.filter((task) => task.list_id === selectedList.value);
  }

  // Priority filter
  if (selectedPriority.value) {
    tasks = tasks.filter((task) => task.priority === selectedPriority.value);
  }

  // Status filter
  if (selectedStatus.value) {
    switch (selectedStatus.value) {
      case 'pending':
        tasks = tasks.filter((task) => !task.completed);
        break;
      case 'completed':
        tasks = tasks.filter((task) => task.completed);
        break;
      case 'overdue':
        tasks = tasks.filter(
          (task) => !task.completed && task.due_date && new Date(task.due_date) < new Date(),
        );
        break;
    }
  }

  return tasks;
});

const completedCount = computed(() => filteredTasks.value.filter((task) => task.completed).length);

const hasMoreTasks = computed(() => tasksStore.currentPage < tasksStore.totalPages);

// Methods
async function loadTasks() {
  try {
    await tasksStore.fetchTasks({
      include: 'list,tags',
      per_page: 20,
    });
  } catch (error) {
    window.showNotification('error', 'Failed to load tasks');
  }
}

async function loadMoreTasks() {
  if (isLoadingMore.value || !hasMoreTasks.value) return;

  isLoadingMore.value = true;
  try {
    await tasksStore.fetchTasks({
      include: 'list,tags',
      per_page: 20,
      page: tasksStore.currentPage + 1,
    });
  } catch (error) {
    window.showNotification('error', 'Failed to load more tasks');
  } finally {
    isLoadingMore.value = false;
  }
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

function handleDeleteTask(taskId: number) {
  deletingTaskId.value = taskId;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!deletingTaskId.value) return;

  try {
    await tasksStore.deleteTask(deletingTaskId.value);
    window.showNotification('success', 'Task deleted successfully');
  } catch (error) {
    window.showNotification('error', 'Failed to delete task');
  } finally {
    showDeleteModal.value = false;
    deletingTaskId.value = null;
  }
}

function handleDuplicateTask(task: Task) {
  editingTask.value = {
    ...task,
    id: 0, // Will be ignored when creating
    title: `${task.title} (Copy)`,
    completed: false,
    created_at: '',
    updated_at: '',
  } as Task;
  showTaskModal.value = true;
}

function handleMoveTask(task: Task) {
  // Future: Open list selection modal
  window.showNotification('info', 'Move task feature coming soon!');
}

function handleArchiveTask(taskId: number) {
  // Future: Archive functionality
  window.showNotification('info', 'Archive feature coming soon!');
}

function closeTaskModal() {
  showTaskModal.value = false;
  editingTask.value = null;
}

function handleTaskSuccess(task: Task) {
  // Task is already updated in the store
  closeTaskModal();
}

// Watch for filter changes to reload tasks
watch([selectedList, selectedPriority, selectedStatus], () => {
  // Could implement server-side filtering here
  // For now, we filter client-side
});

onMounted(async () => {
  await Promise.all([loadTasks(), tasksStore.fetchTaskLists()]);
});
</script>
