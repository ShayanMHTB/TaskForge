// web/src/stores/tasks.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { Task, TaskList, TaskFormData, TaskListFormData, TaskFilters } from '@/types/api';

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([]);
  const taskLists = ref<TaskList[]>([]);
  const currentTask = ref<Task | null>(null);
  const currentTaskList = ref<TaskList | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalTasks = ref(0);
  const perPage = ref(15);

  // Filters
  const filters = ref<TaskFilters>({
    sort: 'position',
    order: 'asc',
    include: 'list,tags',
  });

  // Getters
  const pendingTasks = computed(() => tasks.value.filter((task) => !task.completed));

  const completedTasks = computed(() => tasks.value.filter((task) => task.completed));

  const overdueTasks = computed(() =>
    tasks.value.filter(
      (task) => !task.completed && task.due_date && new Date(task.due_date) < new Date(),
    ),
  );

  const tasksByPriority = computed(() => ({
    high: tasks.value.filter((task) => task.priority === 'high'),
    medium: tasks.value.filter((task) => task.priority === 'medium'),
    low: tasks.value.filter((task) => task.priority === 'low'),
  }));

  const taskListsWithCounts = computed(() =>
    taskLists.value.map((list) => ({
      ...list,
      tasks_count: tasks.value.filter((task) => task.list_id === list.id).length,
      completed_tasks_count: tasks.value.filter(
        (task) => task.list_id === list.id && task.completed,
      ).length,
    })),
  );

  // Task Lists Actions
  async function fetchTaskLists() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getTaskLists('tasks_count');
      taskLists.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch task lists';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTaskList(data: TaskListFormData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.createTaskList(data);
      taskLists.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to create task list';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTaskList(id: number, data: TaskListFormData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.updateTaskList(id, data);
      const index = taskLists.value.findIndex((list) => list.id === id);
      if (index !== -1) {
        taskLists.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to update task list';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTaskList(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      await api.deleteTaskList(id);
      taskLists.value = taskLists.value.filter((list) => list.id !== id);
      // Remove tasks from deleted list
      tasks.value = tasks.value.filter((task) => task.list_id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to delete task list';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Tasks Actions
  async function fetchTasks(customFilters?: Partial<TaskFilters>) {
    isLoading.value = true;
    error.value = null;

    try {
      const queryFilters = { ...filters.value, ...customFilters };
      const response = await api.getTasks(queryFilters);

      tasks.value = response.data;
      currentPage.value = response.meta.current_page;
      totalPages.value = response.meta.last_page;
      totalTasks.value = response.meta.total;
      perPage.value = response.meta.per_page;

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch tasks';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(data: TaskFormData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.createTask(data);
      tasks.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to create task';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTask(id: number, data: Partial<TaskFormData>) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.updateTask(id, data);
      const index = tasks.value.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }

      if (currentTask.value?.id === id) {
        currentTask.value = response.data;
      }

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to update task';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      await api.deleteTask(id);
      tasks.value = tasks.value.filter((task) => task.id !== id);

      if (currentTask.value?.id === id) {
        currentTask.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to delete task';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await api.toggleTask(id);
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = { ...task, ...response.data };
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to toggle task';
      throw err;
    }
  }

  // Utility functions
  function setFilters(newFilters: Partial<TaskFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function clearError() {
    error.value = null;
  }

  function setCurrentTask(task: Task | null) {
    currentTask.value = task;
  }

  function setCurrentTaskList(taskList: TaskList | null) {
    currentTaskList.value = taskList;
  }

  function $reset() {
    tasks.value = [];
    taskLists.value = [];
    currentTask.value = null;
    currentTaskList.value = null;
    isLoading.value = false;
    error.value = null;
    currentPage.value = 1;
    totalPages.value = 1;
    totalTasks.value = 0;
    perPage.value = 15;
    filters.value = {
      sort: 'position',
      order: 'asc',
      include: 'list,tags',
    };
  }

  return {
    // State
    tasks,
    taskLists,
    currentTask,
    currentTaskList,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalTasks,
    perPage,
    filters,
    // Getters
    pendingTasks,
    completedTasks,
    overdueTasks,
    tasksByPriority,
    taskListsWithCounts,
    // Actions
    fetchTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilters,
    clearError,
    setCurrentTask,
    setCurrentTaskList,
    $reset,
  };
});
