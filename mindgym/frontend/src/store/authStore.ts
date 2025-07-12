import { create } from 'zustand';
import { AuthState, User, RegisterData } from '../types';

// Temporary API functions - will be replaced with actual API calls
const tempApi = {
  login: async (data: { email: string; password: string }) => {
    // Simulate API call
    return {
      data: {
        token: 'temp-token',
        user: {
          _id: '1',
          username: 'testuser',
          email: data.email,
          role: 'user' as const,
          profile: {},
          stats: {
            totalProblems: 0,
            solvedProblems: 0,
            totalSubmissions: 0,
            acceptedSubmissions: 0,
            rank: 0,
            languages: []
          },
          solvedProblems: [],
          isActive: true,
          joinDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    };
  },
  register: async (data: RegisterData) => {
    // Simulate API call
    return {
      data: {
        token: 'temp-token',
        user: {
          _id: '1',
          username: data.username,
          email: data.email,
          role: 'user' as const,
          profile: {
            firstName: data.firstName,
            lastName: data.lastName
          },
          stats: {
            totalProblems: 0,
            solvedProblems: 0,
            totalSubmissions: 0,
            acceptedSubmissions: 0,
            rank: 0,
            languages: []
          },
          solvedProblems: [],
          isActive: true,
          joinDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    };
  },
  updateProfile: async (data: any) => {
    return { data: { user: null } };
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await tempApi.login({ email, password });
      const { token, user } = response.data;
      
      set({
        user,
        token,
        isAuthenticated: true,
      });
      
      // Store in localStorage
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
      
      console.log('Login successful!');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await tempApi.register(data);
      const { token, user } = response.data;
      
      set({
        user,
        token,
        isAuthenticated: true,
      });
      
      // Store in localStorage
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
      
      console.log('Registration successful!');
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    
    console.log('Logged out successfully');
  },

  updateProfile: async (data: Partial<User['profile']>) => {
    try {
      const response = await tempApi.updateProfile(data);
      const { user } = response.data;
      
      set({ user });
      console.log('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },
}));