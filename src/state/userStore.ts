import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  clearError: () => void;
}

// Mock authentication functions - replace with real API calls
const mockSignIn = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid email or password');
  }

  // Mock successful login
  return {
    id: 'user_' + Date.now(),
    email,
    name: email.split('@')[0],
  };
};

const mockSignUp = async (email: string, password: string, name?: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation
  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid email or password');
  }

  // Mock successful registration
  return {
    id: 'user_' + Date.now(),
    email,
    name: name || email.split('@')[0],
  };
};

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockSignIn(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign in failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, name?: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await mockSignUp(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign up failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          // Mock Google sign in
          await new Promise(resolve => setTimeout(resolve, 1000));
          const user: User = {
            id: 'google_' + Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: 'https://via.placeholder.com/40',
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Google sign in failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signInWithApple: async () => {
        try {
          set({ isLoading: true, error: null });
          // Mock Apple sign in
          await new Promise(resolve => setTimeout(resolve, 1000));
          const user: User = {
            id: 'apple_' + Date.now(),
            email: 'user@icloud.com',
            name: 'Apple User',
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Apple sign in failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      continueAsGuest: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
