// src/stores/auth.store.ts
import { proxy } from 'valtio';
import { request } from '@umijs/max';
import { KRATOS_BROWSER_URL, APP_URL } from '@/constants/config';

interface User {
  id: string;
  email: string;
  traits: {
    email: string;
    name?: string;
  };
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
      const response = await request<User>('/auth/me');
      authStore.user = response;
      authStore.initialized = true;
      return response;
    } catch (error) {
      authStore.user = null;
      authStore.initialized = true;
      throw error;
    } finally {
      authStore.loading = false;
    }
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
      authStore.user = null;
      // Create logout flow with Kratos
      const response = await fetch(`${KRATOS_BROWSER_URL}/self-service/logout/browser`, {
        credentials: 'include',
      });
      const flow = await response.json();
      // Redirect to logout URL
      window.location.href = flow.logout_url;
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: just redirect to login
      window.location.href = APP_URL + '/login';
    }
  },

  async redirectToLogin() {
    try {
      // Create login flow
      const response = await fetch(`${KRATOS_BROWSER_URL}/self-service/login/browser`, {
        credentials: 'include',
      });
      const flow = await response.json();
      
      // Find Google provider
      const googleProvider = flow.ui.nodes.find((node: any) => 
        node.attributes?.value === 'google'
      );
      
      if (googleProvider) {
        // Redirect to Google OAuth
        window.location.href = googleProvider.attributes.action;
      } else {
        console.error('Google provider not found');
      }
    } catch (error) {
      console.error('Login redirect failed:', error);
    }
  },

  async redirectToRegistration() {
    try {
      // Create registration flow
      const response = await fetch(`${KRATOS_BROWSER_URL}/self-service/registration/browser`, {
        credentials: 'include',
      });
      const flow = await response.json();
      
      // Find Google provider
      const googleProvider = flow.ui.nodes.find((node: any) => 
        node.attributes?.value === 'google'
      );
      
      if (googleProvider) {
        // Redirect to Google OAuth
        window.location.href = googleProvider.attributes.action;
      } else {
        console.error('Google provider not found');
      }
    } catch (error) {
      console.error('Registration redirect failed:', error);
    }
  },
};