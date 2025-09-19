import axios from 'axios';
import { type Task } from '@/components/TaskCard';
import { auth } from './authApi';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear session and redirect to login
      try {
        await auth.logout();
      } catch (e) {
        console.error('Failed to logout:', e);
      }
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