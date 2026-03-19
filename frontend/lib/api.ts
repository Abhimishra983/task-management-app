import axios from 'axios';
import { Task, TaskFormData } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // 🔐 REGISTER
  async register(username: string, email: string, password: string) {
    const response = await axiosInstance.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  // 🔐 LOGIN (FIXED ✅)
  async login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await axiosInstance.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  // 📋 GET TASKS
  async getTasks(status?: string): Promise<Task[]> {
    const params = status ? { status } : {};
    const response = await axiosInstance.get('/tasks/', { params });
    return response.data;
  },

  // ➕ CREATE TASK
  async createTask(task: TaskFormData): Promise<Task> {
    const response = await axiosInstance.post('/tasks/', task);
    return response.data;
  },

  // ✏️ UPDATE TASK
  async updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
    const response = await axiosInstance.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // ❌ DELETE TASK
  async deleteTask(taskId: number): Promise<void> {
    await axiosInstance.delete(`/tasks/${taskId}`);
  },
};