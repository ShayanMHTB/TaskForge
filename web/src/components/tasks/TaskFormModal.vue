<!-- web/src/components/tasks/TaskFormModal.vue -->

<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingTask ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <!-- Title -->
            <BaseInput
              v-model="form.title"
              label="Task title"
              placeholder="What needs to be done?"
              required
              :error="errors.title"
              clearable
            />

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:disabled:bg-gray-700"
                placeholder="Add more details..."
                :class="[
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                    : '',
                ]"
              ></textarea>
              <p v-if="errors.description" class="text-sm text-red-600 dark:text-red-400">
                {{ errors.description }}
              </p>
            </div>

            <!-- Task List Selection -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                List
              </label>
              <select
                v-model="form.list_id"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
              >
                <option :value="null">No list</option>
                <option v-for="list in tasksStore.taskLists" :key="list.id" :value="list.id">
                  {{ list.name }}
                </option>
              </select>
            </div>

            <!-- Due Date -->
            <BaseInput
              v-model="form.due_date"
              type="datetime-local"
              label="Due date"
              :error="errors.due_date"
            />

            <!-- Priority -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <div class="flex space-x-2">
                <button
                  v-for="priority in priorities"
                  :key="priority.value"
                  type="button"
                  @click="form.priority = priority.value"
                  class="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
                  :class="[
                    form.priority === priority.value
                      ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-700 dark:bg-${priority.color}-900/20 dark:text-${priority.color}-400`
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                  ]"
                >
                  <div
                    class="h-2 w-2 rounded-full mr-2"
                    :class="[
                      priority.value === 'high'
                        ? 'bg-red-500'
                        : priority.value === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400',
                    ]"
                  ></div>
                  {{ priority.label }}
                </button>
              </div>
            </div>

            <!-- Tags Section (Future enhancement) -->
            <div v-if="false" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div class="flex flex-wrap gap-2">
                <!-- Tag selection will go here -->
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex space-x-3 pt-4">
              <BaseButton type="button" variant="outline" @click="closeModal" class="flex-1">
                Cancel
              </BaseButton>
              <BaseButton type="submit" variant="primary" :loading="isLoading" class="flex-1">
                {{ editingTask ? 'Update Task' : 'Create Task' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { Task, TaskFormData } from '@/types/api';

interface Props {
  show: boolean;
  editingTask?: Task | null;
}

const props = withDefaults(defineProps<Props>(), {
  editingTask: null,
});

const emit = defineEmits<{
  close: [];
  success: [task: Task];
}>();

const tasksStore = useTasksStore();
const isLoading = ref(false);

const form = reactive<TaskFormData>({
  title: '',
  description: '',
  list_id: null,
  due_date: '',
  priority: 'medium',
});

const errors = reactive({
  title: '',
  description: '',
  due_date: '',
});

const priorities = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'red' },
];

// Watch for editing task changes
watch(
  () => props.editingTask,
  (task) => {
    if (task) {
      form.title = task.title;
      form.description = task.description || '';
      form.list_id = task.list_id;
      form.due_date = task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '';
      form.priority = task.priority;
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

function resetForm() {
  form.title = '';
  form.description = '';
  form.list_id = null;
  form.due_date = '';
  form.priority = 'medium';

  // Clear errors
  errors.title = '';
  errors.description = '';
  errors.due_date = '';
}

function validateForm() {
  let isValid = true;

  // Reset errors
  errors.title = '';
  errors.description = '';
  errors.due_date = '';

  if (!form.title.trim()) {
    errors.title = 'Task title is required';
    isValid = false;
  } else if (form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
    isValid = false;
  }

  if (form.description && form.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters';
    isValid = false;
  }

  if (form.due_date) {
    const dueDate = new Date(form.due_date);
    const now = new Date();
    if (dueDate < now) {
      errors.due_date = 'Due date cannot be in the past';
      isValid = false;
    }
  }

  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const taskData: TaskFormData = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      list_id: form.list_id,
      due_date: form.due_date || undefined,
      priority: form.priority,
    };

    let result: Task;

    if (props.editingTask) {
      result = await tasksStore.updateTask(props.editingTask.id, taskData);
      window.showNotification('success', 'Task updated successfully');
    } else {
      result = await tasksStore.createTask(taskData);
      window.showNotification('success', 'Task created successfully');
    }

    emit('success', result);
    closeModal();
  } catch (error: any) {
    console.error('Task form error:', error);

    // Handle validation errors from server
    if (error.response?.data?.error?.details) {
      const details = error.response.data.error.details;
      if (details.title) errors.title = details.title[0];
      if (details.description) errors.description = details.description[0];
      if (details.due_date) errors.due_date = details.due_date[0];
    } else {
      window.showNotification('error', 'Failed to save task');
    }
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  resetForm();
  emit('close');
}
</script>
