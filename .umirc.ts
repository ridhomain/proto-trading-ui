import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Proto Trading',
    locale: false,
  },
  routes: [
    {
      path: '/',
      component: './Home',
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: './Dashboard',
      icon: 'DashboardOutlined',
    },
    {
      name: 'Market Data',
      path: '/market',
      component: './Market',
      icon: 'StockOutlined',
    },
    {
      name: 'Charts',
      path: '/charts',
      component: './Charts',
      icon: 'LineChartOutlined',
    },
    {
      name: 'Upload',
      path: '/upload',
      component: './Upload',
      icon: 'UploadOutlined',
    },
    {
      name: 'Profile',
      path: '/profile',
      component: './Profile',
      hideInMenu: true,
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/auth': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  theme: {
    'primary-color': '#1890ff',
  },
});