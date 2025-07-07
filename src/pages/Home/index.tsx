// src/pages/Home/index.tsx
import { Button, Card, Col, Row, Typography } from 'antd';
import { LineChartOutlined, DatabaseOutlined, UploadOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useSnapshot } from 'valtio';
import { authStore, authActions } from '@/stores/auth.store';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const snap = useSnapshot(authStore);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>Welcome to Proto Trading</Title>
        <Paragraph style={{ fontSize: '18px' }}>
          Your professional Indonesian stock market data platform
        </Paragraph>
        
        {!snap.user && (
          <div style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => authActions.redirectToLogin()}
              style={{ marginRight: '16px' }}
            >
              Login
            </Button>
            <Button 
              size="large" 
              onClick={() => authActions.redirectToRegistration()}
            >
              Sign Up
            </Button>
          </div>
        )}
        
        {snap.user && (
          <div style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => history.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <LineChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={3}>Real-time Charts</Title>
            <Paragraph>
              Interactive charts for Indonesian stocks with technical indicators
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <DatabaseOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={3}>Market Data</Title>
            <Paragraph>
              Comprehensive data from Yahoo Finance and Mirae Securities
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={3}>CSV Import</Title>
            <Paragraph>
              Easy data import from your broker's CSV files
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}