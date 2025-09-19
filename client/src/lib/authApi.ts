import axios from 'axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
}

// Use the same base URL as the main API
const API_BASE_URL = process.env.VITE_API_URL || '/api';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true // Required for cross-origin requests with credentials
});

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const response = await authApi.post<User>('/login', credentials);
    return response.data;
  },

  logout: async () => {
    await authApi.post('/logout');
  },

  getCurrentUser: async () => {
    try {
      const response = await authApi.get<User>('/user');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  }
};