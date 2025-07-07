// src/app.ts
import React from 'react';
import { history, RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { message } from 'antd';
import { authStore, authActions } from '@/stores/auth.store';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

// Global request configuration
export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorHandler: (error: any) => {
      const { response } = error;
      
      // Don't redirect on 401 during initialization
      if (authStore.initialized === false) {
        return;
      }
      
      if (response?.status === 401) {
        // Only redirect if we're not already on the home page
        if (window.location.pathname !== '/') {
          authStore.user = null;
          message.error('Please login to continue');
          authActions.redirectToLogin();
        }
      } else if (response?.status === 403) {
        message.error('You do not have permission for this action');
      } else if (response?.status >= 500) {
        message.error('Server error, please try again later');
      }
    },
  },
  requestInterceptors: [
    (url, options) => {
      return {
        url,
        options: {
          ...options,
          credentials: 'include', // Important for cookies
        },
      };
    },
  ],
};

// Get initial state
export async function getInitialState() {
  // Skip auth check if we're being redirected from Kratos
  const urlParams = new URLSearchParams(window.location.search);
  const isCallback = urlParams.has('code') || urlParams.has('flow');
  
  if (isCallback) {
    return {
      currentUser: null,
      settings: {
        layout: 'mix',
        navTheme: 'light',
      },
    };
  }

  try {
    const user = await authActions.fetchCurrentUser();
    return {
      currentUser: user,
      settings: {
        layout: 'mix',
        navTheme: 'light',
      },
    };
  } catch (error) {
    // Not logged in - this is OK
    return {
      currentUser: null,
      settings: {
        layout: 'mix',
        navTheme: 'light',
      },
    };
  }
}

// ProLayout configuration
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Proto Trading',
    rightContentRender: RightContent,
    footerRender: Footer,
    // Temporarily disable automatic redirects
    // onPageChange: () => {
    //   const { location } = history;
    //   // Protected routes
    //   const protectedPaths = ['/dashboard', '/market', '/charts', '/upload', '/profile'];
    //   const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
      
    //   if (!initialState?.currentUser && isProtected) {
    //     authActions.redirectToLogin();
    //   }
    // },
  };
};