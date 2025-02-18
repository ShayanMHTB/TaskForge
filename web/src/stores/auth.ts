// web/src/stores/auth.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => user.value?.name || '');
  const userEmail = computed(() => user.value?.email || '');

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.login(credentials);
      user.value = response.data;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.register(credentials);
      user.value = response.data;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;

    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      user.value = null;
      isLoading.value = false;
    }
  }

  async function fetchUser() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.getUser();
      user.value = response.data;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch user';
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function $reset() {
    user.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    clearError,
    $reset,
  };
});
