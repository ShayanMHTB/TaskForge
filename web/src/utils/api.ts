// web/src/utils/api.ts

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  User,
  TaskList,
  Task,
  Tag,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  LoginCredentials,
  RegisterCredentials,
  TaskFormData,
  TaskListFormData,
  TaskFilters,
} from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true, // Important for Sanctum SPA auth
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - could emit event to logout user
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
      },
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  // Authentication endpoints
  async getCsrfCookie(): Promise<void> {
    await this.client.get('/sanctum/csrf-cookie', {
      baseURL: import.meta.env.VITE_API_URL.replace('/api/v1', ''),
    });
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
    await this.getCsrfCookie();
    const response = await this.client.post<ApiResponse<User>>('/auth/register', credentials);
    return this.handleResponse(response);
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    await this.getCsrfCookie();
    const response = await this.client.post<ApiResponse<User>>('/auth/login', credentials);
    return this.handleResponse(response);
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get<ApiResponse<User>>('/auth/user');
    return this.handleResponse(response);
  }

  // Task Lists endpoints
  async getTaskLists(include?: string): Promise<ApiResponse<TaskList[]>> {
    const params = include ? { include } : {};
    const response = await this.client.get<ApiResponse<TaskList[]>>('/task-lists', { params });
    return this.handleResponse(response);
  }

  async getTaskList(id: number, include?: string): Promise<ApiResponse<TaskList>> {
    const params = include ? { include } : {};
    const response = await this.client.get<ApiResponse<TaskList>>(`/task-lists/${id}`, { params });
    return this.handleResponse(response);
  }

  async createTaskList(data: TaskListFormData): Promise<ApiResponse<TaskList>> {
    const response = await this.client.post<ApiResponse<TaskList>>('/task-lists', data);
    return this.handleResponse(response);
  }

  async updateTaskList(id: number, data: TaskListFormData): Promise<ApiResponse<TaskList>> {
    const response = await this.client.put<ApiResponse<TaskList>>(`/task-lists/${id}`, data);
    return this.handleResponse(response);
  }

  async deleteTaskList(id: number): Promise<void> {
    await this.client.delete(`/task-lists/${id}`);
  }

  async reorderTaskLists(
    lists: Array<{ id: number; position: number }>,
  ): Promise<ApiResponse<any>> {
    const response = await this.client.post<ApiResponse<any>>('/task-lists/reorder', { lists });
    return this.handleResponse(response);
  }

  // Tasks endpoints
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    const response = await this.client.get<PaginatedResponse<Task>>('/tasks', {
      params: filters,
    });
    return this.handleResponse(response);
  }

  async getTask(id: number, include?: string): Promise<ApiResponse<Task>> {
    const params = include ? { include } : {};
    const response = await this.client.get<ApiResponse<Task>>(`/tasks/${id}`, { params });
    return this.handleResponse(response);
  }

  async createTask(data: TaskFormData): Promise<ApiResponse<Task>> {
    const response = await this.client.post<ApiResponse<Task>>('/tasks', data);
    return this.handleResponse(response);
  }

  async updateTask(id: number, data: Partial<TaskFormData>): Promise<ApiResponse<Task>> {
    const response = await this.client.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return this.handleResponse(response);
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async toggleTask(id: number): Promise<ApiResponse<Partial<Task>>> {
    const response = await this.client.post<ApiResponse<Partial<Task>>>(`/tasks/${id}/toggle`);
    return this.handleResponse(response);
  }

  async reorderTasks(
    tasks: Array<{ id: number; position: number; list_id?: number | null }>,
  ): Promise<ApiResponse<any>> {
    const response = await this.client.post<ApiResponse<any>>('/tasks/reorder', { tasks });
    return this.handleResponse(response);
  }

  // Tags endpoints (for future implementation)
  async getTags(): Promise<ApiResponse<Tag[]>> {
    const response = await this.client.get<ApiResponse<Tag[]>>('/tags');
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
