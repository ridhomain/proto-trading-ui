import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, Space, Avatar, Tag } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { authStore, authActions } from '@/stores/auth.store';
import { marketStore } from '@/stores/market.store';
import dayjs from 'dayjs';

export default function ProfilePage() {
  const authSnap = useSnapshot(authStore);
  const marketSnap = useSnapshot(marketStore);

  if (!authSnap.user) {
    return null;
  }

  return (
    <ProCard ghost gutter={[16, 16]}>
      <ProCard colSpan={24} title="User Information">
        <Space align="start" size={24}>
          <Avatar size={80} icon={<UserOutlined />} />
          <div>
            <ProDescriptions
              column={2}
              dataSource={authSnap.user}
              columns={[
                {
                  title: 'Email',
                  dataIndex: ['traits', 'email'],
                  render: (text) => <strong>{text}</strong>,
                },
                {
                  title: 'User ID',
                  dataIndex: 'id',
                  copyable: true,
                },
                {
                  title: 'Name',
                  dataIndex: ['traits', 'name'],
                  render: (text) => text || 'Not provided',
                },
                {
                  title: 'Account Type',
                  render: () => <Tag color="blue">Google OAuth</Tag>,
                },
              ]}
            />
          </div>
        </Space>
      </ProCard>

      <ProCard colSpan={12} title="Preferences">
        <ProDescriptions
          column={1}
          columns={[
            {
              title: 'Default Data Source',
              render: () => (
                <Tag color={marketSnap.dataSource === 'yahoo' ? 'blue' : 'green'}>
                  {marketSnap.dataSource === 'yahoo' ? 'Yahoo Finance' : 'Mirae Asset'}
                </Tag>
              ),
            },
            {
              title: 'Watchlist',
              render: () => (
                <Space wrap>
                  {marketSnap.watchlist.map(symbol => (
                    <Tag key={symbol} color="gold">{symbol}</Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: 'Total Watchlist Items',
              render: () => marketSnap.watchlist.length,
            },
          ]}
        />
      </ProCard>

      <ProCard colSpan={12} title="Activity Summary">
        <ProDescriptions
          column={1}
          columns={[
            {
              title: 'Total Market Data Records',
              render: () => marketSnap.stats.totalRecords,
            },
            {
              title: 'Last Data Update',
              render: () => 
                marketSnap.stats.lastUpdated 
                  ? dayjs(marketSnap.stats.lastUpdated).format('DD/MM/YYYY HH:mm:ss')
                  : 'Never',
            },
            {
              title: 'Selected Symbol',
              render: () => <Tag color="processing">{marketSnap.selectedSymbol}</Tag>,
            },
          ]}
        />
      </ProCard>

      <ProCard colSpan={24}>
        <Space>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => authActions.logout()}
          >
            Logout
          </Button>
        </Space>
      </ProCard>
    </ProCard>
  );
}