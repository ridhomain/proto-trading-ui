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
      if (response?.status === 401) {
        authStore.user = null;
        history.push('/login');
        message.error('Please login to continue');
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
          credentials: 'include',
        },
      };
    },
  ],
};

// Get initial state
export async function getInitialState() {
  try {
    const userInfo = await authActions.fetchCurrentUser();
    return {
      currentUser: userInfo,
      settings: {
        layout: 'mix',
        navTheme: 'light',
      },
    };
  } catch (error) {
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
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== '/login') {
        history.push('/login');
      }
    },
  };
};
