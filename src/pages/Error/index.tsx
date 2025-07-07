// src/pages/Error/index.tsx
import { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import { history, useSearchParams } from '@umijs/max';
import { kratos } from '@/stores/auth.store';

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const errorId = searchParams.get('id');

  useEffect(() => {
    if (errorId) {
      // Fetch error details from Kratos
      fetchError(errorId);
    } else {
      setLoading(false);
    }
  }, [errorId]);

  const fetchError = async (id: string) => {
    try {
      const { data } = await kratos.getFlowError({ id });
      setError(data);
    } catch (err) {
      console.error('Failed to fetch error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = () => {
    if (!error) return 'An unknown error occurred';
    
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.ui?.messages?.[0]?.text) {
      return error.ui.messages[0].text;
    }
    
    return 'Authentication failed. Please try again.';
  };

  const handleBackToLogin = () => {
    history.push('/login');
  };

  if (loading) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Result
        status="error"
        title="Authentication Error"
        subTitle={getErrorMessage()}
        extra={[
          <Button type="primary" key="login" onClick={handleBackToLogin}>
            Back to Login
          </Button>,
        ]}
      />
    </div>
  );
}