import axios from 'axios';
import { type Task } from '@/components/TaskCard';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'completed'>;
export type UpdateTaskData = Partial<CreateTaskData>;

export const taskApi = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  createTask: async (task: CreateTaskData) => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, task: UpdateTaskData) => {
    const response = await api.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },

  toggleTask: async (id: string, completed: boolean) => {
    const response = await api.patch<Task>(`/tasks/${id}`, { completed });
    return response.data;
  }
};