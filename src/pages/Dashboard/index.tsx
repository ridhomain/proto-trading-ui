// src/pages/Dashboard/index.tsx
import { useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { authStore, authActions } from '@/stores/auth.store';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const snap = useSnapshot(authStore);

  useEffect(() => {
    // If not logged in, redirect to login
    if (snap.initialized && !snap.user) {
      authActions.redirectToLogin(window.location.href);
    }
  }, [snap.initialized, snap.user]);

  // Show loading while checking auth
  if (!snap.initialized || !snap.user) {
    return null;
  }

  // Mock data for demonstration
  const portfolioData = [
    { symbol: 'BBCA.JK', name: 'Bank Central Asia', price: 8650, change: 1.2 },
    { symbol: 'BBRI.JK', name: 'Bank Rakyat Indonesia', price: 4750, change: -0.5 },
    { symbol: 'TLKM.JK', name: 'Telkom Indonesia', price: 3250, change: 2.1 },
  ];

  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `Rp ${price.toLocaleString()}` },
    {
      title: 'Change %',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <span style={{ color: change > 0 ? '#3f8600' : '#cf1322' }}>
          {change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(change)}%
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Paragraph>Welcome back, {snap.user.email}!</Paragraph>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Portfolio Value"
              value={125430000}
              prefix="Rp"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Gain/Loss"
              value={2.3}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Positions"
              value={12}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Your Watchlist">
        <Table 
          dataSource={portfolioData} 
          columns={columns} 
          rowKey="symbol"
          pagination={false}
        />
      </Card>
    </div>
  );
}