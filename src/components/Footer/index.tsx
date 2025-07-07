import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

export default function Footer() {
  return (
    <DefaultFooter
      style={{ background: 'none' }}
      copyright={`${new Date().getFullYear()} Proto Trading`}
      links={[
        {
          key: 'Proto Trading',
          title: 'Proto Trading',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
}