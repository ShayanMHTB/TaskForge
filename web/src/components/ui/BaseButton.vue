<!-- web/src/components/ui/BaseButton.vue -->

<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <div class="flex items-center justify-center gap-2">
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <!-- Icon slot -->
      <slot name="icon" v-if="!loading" />

      <!-- Content -->
      <span v-if="$slots.default">
        <slot />
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  tag?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  tag: 'button',
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'transform hover:scale-[1.02] active:scale-[0.98]',
  ];

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const variantClasses = {
    primary: [
      'bg-blue-600 text-white shadow-sm',
      'hover:bg-blue-700 hover:shadow-md',
      'focus-visible:ring-blue-500',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
    ],
    secondary: [
      'bg-gray-100 text-gray-900 shadow-sm',
      'hover:bg-gray-200 hover:shadow-md',
      'focus-visible:ring-gray-500',
      'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ],
    outline: [
      'border border-gray-300 bg-transparent text-gray-700 shadow-sm',
      'hover:bg-gray-50 hover:shadow-md',
      'focus-visible:ring-gray-500',
      'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    ],
    ghost: [
      'bg-transparent text-gray-700',
      'hover:bg-gray-100',
      'focus-visible:ring-gray-500',
      'dark:text-gray-300 dark:hover:bg-gray-800',
    ],
    danger: [
      'bg-red-600 text-white shadow-sm',
      'hover:bg-red-700 hover:shadow-md',
      'focus-visible:ring-red-500',
      'dark:bg-red-500 dark:hover:bg-red-600',
    ],
  };

  return [...baseClasses, sizeClasses[props.size], ...variantClasses[props.variant]].join(' ');
});

function handleClick(event: Event) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>
