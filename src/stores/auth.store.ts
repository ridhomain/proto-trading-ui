// src/stores/auth.store.ts
import { proxy } from 'valtio';
import { request } from '@umijs/max';

interface User {
  id: string;
  email: string;
  traits: {
    email: string;
    name?: string;
    role?: string;
  };
  preferences?: any;
}

export const authStore = proxy({
  user: null as User | null,
  loading: false,
  initialized: false,
});

export const authActions = {
  async fetchCurrentUser() {
    authStore.loading = true;
    try {
      // Call your backend, which validates with Kratos
      const response = await request<any>('/auth/me', {
        errorHandler: (error: any) => {
          // Don't show error message for 401
          if (error?.response?.status === 401) {
            return null;
          }
          throw error;
        },
      });
      
      if (!response) {
        authStore.user = null;
        authStore.initialized = true;
        return null;
      }
      
      authStore.user = {
        id: response.user_id,
        email: response.email,
        traits: {
          email: response.email,
          ...response.traits,
        },
        preferences: response.preferences,
      };
      authStore.initialized = true;
      return authStore.user;
    } catch (error) {
      authStore.user = null;
      authStore.initialized = true;
      return null;
    } finally {
      authStore.loading = false;
    }
  },

  // Redirect to Kratos UI pages
  redirectToLogin(returnTo?: string) {
    const returnUrl = returnTo || window.location.href;
    window.location.href = `http://127.0.0.1:4433/self-service/login/browser?return_to=${encodeURIComponent(returnUrl)}`;
  },

  redirectToRegistration(returnTo?: string) {
    const returnUrl = returnTo || 'http://localhost:8000/dashboard';
    window.location.href = `http://127.0.0.1:4433/self-service/registration/browser?return_to=${encodeURIComponent(returnUrl)}`;
  },

  redirectToSettings() {
    window.location.href = 'http://127.0.0.1:4433/self-service/settings/browser';
  },

  async logout() {
    try {
      // Notify your backend
      await request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Continue with logout even if backend fails
    }
    
    // Clear local state
    authStore.user = null;
    
    // Redirect to Kratos logout
    window.location.href = 'http://127.0.0.1:4433/self-service/logout/browser?return_to=http://localhost:8000';
  },
};