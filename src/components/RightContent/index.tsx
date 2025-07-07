// src/components/RightContent/index.tsx
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { Avatar, Menu, Spin, Dropdown, Button, Space } from 'antd';
import { history } from '@umijs/max';
import { authStore, authActions } from '@/stores/auth.store';

export default function RightContent() {
  const snap = useSnapshot(authStore);

  if (!snap.initialized) {
    return <Spin size="small" style={{ marginRight: 8 }} />;
  }

  if (!snap.user) {
    return (
      <Space>
        <Button type="primary" onClick={() => authActions.redirectToLogin()}>
          Login
        </Button>
        <Button onClick={() => authActions.redirectToRegistration()}>
          Sign Up
        </Button>
      </Space>
    );
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => history.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => authActions.redirectToSettings(),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => authActions.logout(),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Space style={{ cursor: 'pointer' }}>
        <Avatar size="small" icon={<UserOutlined />} />
        <span>{snap.user.email}</span>
      </Space>
    </Dropdown>
  );
};