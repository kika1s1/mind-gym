import axios from 'axios';
import { RegisterData, LoginData, Problem, ProblemsResponse, Submission, SubmissionsResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const problemsApi = {
  getProblems: (params?: any) => api.get<ProblemsResponse>('/problems', { params }),
  getProblem: (id: string) => api.get<{ problem: Problem }>(`/problems/${id}`),
  getStats: () => api.get('/problems/stats'),
};

export const submissionsApi = {
  submit: (data: { problemId: string; userCode: string; language: string }) => 
    api.post('/submissions', data),
  getSubmissionStatus: (id: string) => api.get<{ submission: Submission }>(`/submissions/${id}`),
  getUserSubmissions: (params?: any) => api.get<SubmissionsResponse>('/submissions/user', { params }),
  getSubmissionCode: (id: string) => api.get(`/submissions/${id}/code`),
  getStats: () => api.get('/submissions/stats'),
};

export default api;