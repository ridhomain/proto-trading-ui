import { Button, Card, Typography, Space } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { authActions } from '@/stores/auth.store';

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>
              Welcome to Proto Trading
            </Title>
            <Paragraph type="secondary">
              Professional trading dashboard for Indonesian stock market
            </Paragraph>
          </div>

          <Button
            type="primary"
            icon={<GoogleOutlined />}
            size="large"
            block
            onClick={() => authActions.redirectToLogin()}
          >
            Sign in with Google
          </Button>

          <Paragraph>
            Don't have an account?{' '}
            <a onClick={() => authActions.redirectToRegistration()}>
              Register here
            </a>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}