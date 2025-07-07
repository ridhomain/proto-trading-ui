// src/pages/Registration/index.tsx
import { useEffect, useState } from 'react';
import { Card, Button, Space, Spin, message, Alert } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { authActions, kratos } from '@/stores/auth.store';
import { RegistrationFlow } from '@ory/kratos-client';

export default function RegistrationPage() {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeFlow();
  }, []);

  const initializeFlow = async () => {
    try {
      setError(null);
      
      // Check if we already have a flow ID in URL
      const urlParams = new URLSearchParams(window.location.search);
      const flowId = urlParams.get('flow');
      
      if (flowId) {
        // Fetch existing flow from Kratos
        const { data } = await kratos.getRegistrationFlow({ id: flowId });
        setFlow(data);
      } else {
        // Create new flow
        const newFlow = await authActions.createRegistrationFlow();
        setFlow(newFlow);
        
        // Update URL with flow ID
        history.replace(`/registration?flow=${newFlow.id}`);
      }
    } catch (error: any) {
      console.error('Failed to initialize registration flow:', error);
      
      // If flow is expired or invalid, create a new one
      if (error.response?.status === 410 || error.response?.status === 403) {
        try {
          const newFlow = await authActions.createRegistrationFlow();
          setFlow(newFlow);
          history.replace(`/registration?flow=${newFlow.id}`);
        } catch (retryError) {
          setError('Failed to initialize registration. Please refresh the page.');
        }
      } else {
        setError('Failed to initialize registration. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = async () => {
    if (!flow) return;

    setSubmitting(true);
    setError(null);

    try {
      // Find CSRF token from flow nodes
      let csrfToken: string | undefined;
      
      for (const node of flow.ui.nodes) {
        if ('attributes' in node && 
            node.attributes && 
            'name' in node.attributes &&
            node.attributes.name === 'csrf_token' &&
            'value' in node.attributes) {
          csrfToken = node.attributes.value as string;
          break;
        }
      }

      if (!csrfToken) {
        throw new Error('Security token not found');
      }

      // Submit OAuth registration
      await authActions.submitOAuthRegistration(flow.id, csrfToken, 'google');
      
      // If we reach here without redirect, something might be wrong
      message.info('Redirecting to Google...');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.ui?.messages) {
        const errorMessage = error.response.data.ui.messages[0]?.text;
        setError(errorMessage || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
      
      // Refresh the flow if needed
      if (error.response?.status === 410) {
        initializeFlow();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    history.push('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Spin size="large" tip="Initializing..." />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
    }}>
      <Card 
        title="Create Your Account" 
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Join Proto Trading to start managing your portfolio</p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}
          
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            block
            onClick={handleGoogleRegistration}
            loading={submitting}
            disabled={!flow}
            style={{
              height: '48px',
              fontSize: '16px',
              borderRadius: '6px',
            }}
          >
            Sign up with Google
          </Button>

          <div style={{ textAlign: 'center' }}>
            <span>Already have an account? </span>
            <a onClick={handleLoginRedirect}>Sign in</a>
          </div>

          <div style={{ textAlign: 'center', color: '#888' }}>
            <small>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </small>
          </div>
        </Space>
      </Card>
    </div>
  );
}