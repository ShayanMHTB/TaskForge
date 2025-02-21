<!-- web/src/components/ui/BaseInput.vue -->

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Leading icon -->
      <div
        v-if="$slots.leading"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <slot name="leading" />
      </div>

      <!-- Input element -->
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Trailing icon -->
      <div
        v-if="$slots.trailing || showClearButton"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <!-- Clear button -->
        <button
          v-if="showClearButton"
          type="button"
          @click="clearInput"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

        <!-- Custom trailing content -->
        <slot name="trailing" v-else />
      </div>
    </div>

    <!-- Helper text or error -->
    <p
      v-if="error || helperText"
      :class="[
        'text-sm',
        error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
      ]"
    >
      {{ error || helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  clearable: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  clear: [];
}>();

const inputId = useId();
const isFocused = ref(false);

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value),
});

const showClearButton = computed(() => props.clearable && inputValue.value && !props.disabled);

const inputClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2',
    'text-sm text-gray-900 placeholder-gray-500',
    'transition-all duration-200',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
    'dark:placeholder-gray-400 dark:focus:border-blue-400',
    'dark:disabled:bg-gray-700',
  ];

  const paddingClasses = [];
  if (props.$slots?.leading) {
    paddingClasses.push('pl-10');
  }
  if (props.$slots?.trailing || showClearButton.value) {
    paddingClasses.push('pr-10');
  }

  const stateClasses = [];
  if (props.error) {
    stateClasses.push(
      'border-red-300 focus:border-red-500 focus:ring-red-500/20',
      'dark:border-red-500',
    );
  }

  return [...baseClasses, ...paddingClasses, ...stateClasses].join(' ');
});

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit('focus', event);
}

function clearInput() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>
