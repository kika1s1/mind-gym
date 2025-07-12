import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, RegisterData } from '../types';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login({ email, password });
          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
          
          toast.success('Login successful!');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          const response = await authApi.register(data);
          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
          
          toast.success('Registration successful!');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Registration failed';
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Logged out successfully');
      },

      updateProfile: async (data: Partial<User['profile']>) => {
        try {
          const response = await authApi.updateProfile(data);
          const { user } = response.data;
          
          set({ user });
          toast.success('Profile updated successfully!');
        } catch (error: any) {
          const message = error.response?.data?.error || 'Profile update failed';
          toast.error(message);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);