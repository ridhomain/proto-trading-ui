// src/pages/Auth/Callback.tsx
import { useEffect } from 'react';
import { history } from '@umijs/max';
import { Spin } from 'antd';
import { authActions } from '@/stores/auth.store';

export default function CallbackPage() {
  useEffect(() => {
    // After OAuth callback, fetch user and redirect
    authActions.fetchCurrentUser()
      .then(() => {
        history.push('/dashboard');
      })
      .catch(() => {
        history.push('/login');
      });
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Spin size="large" tip="Authenticating..." />
    </div>
  );
}