// web/src/types/api.ts

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskList {
  id: number;
  name: string;
  description: string | null;
  color: string;
  position: number;
  user_id: number;
  tasks_count?: number;
  completed_tasks_count?: number;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  position: number;
  user_id: number;
  list_id: number | null;
  created_at: string;
  updated_at: string;
  task_list?: Pick<TaskList, 'id' | 'name' | 'color'>;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  tasks_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    message?: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  };
  meta: {
    timestamp: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Task form types
export interface TaskFormData {
  title: string;
  description?: string;
  list_id?: number | null;
  due_date?: string | null;
  priority: 'low' | 'medium' | 'high';
  tags?: number[];
}

export interface TaskListFormData {
  name: string;
  description?: string;
  color?: string;
}

// API filters
export interface TaskFilters {
  list_id?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: 'today' | 'overdue' | 'this_week' | 'this_month';
  search?: string;
  sort?: 'title' | 'due_date' | 'priority' | 'created_at' | 'position';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  include?: string;
}
