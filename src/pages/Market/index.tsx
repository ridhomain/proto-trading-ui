import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Tag, Popconfirm } from 'antd';
import { useSnapshot } from 'valtio';
import { useRef } from 'react';
import { marketStore, marketActions } from '@/stores/market.store';
import { IDX_SYMBOLS, SECTOR_COLORS } from '@/constants/symbols';
import { 
  SyncOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { MarketData } from '@/stores/market.store';

export default function MarketPage() {
  const snap = useSnapshot(marketStore);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<MarketData>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      valueType: 'date',
      sorter: true,
      width: 120,
      render: (_, record) => dayjs(record.date).format('DD/MM/YYYY'),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      width: 150,
      filters: IDX_SYMBOLS.map(s => ({ text: s.label, value: s.value })),
      render: (_, record) => {
        const symbol = IDX_SYMBOLS.find(s => s.value === record.symbol);
        return (
          <Space>
            <span style={{ fontWeight: 'bold' }}>{record.symbol}</span>
            {symbol && (
              <Tag color={SECTOR_COLORS[symbol.sector]}>
                {symbol.sector}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Open',
      dataIndex: 'open',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
      render: (text) => `Rp ${Number(text).toLocaleString('id-ID')}`,
    },
    {
      title: 'High',
      dataIndex: 'high',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
      render: (text) => (
        <span style={{ color: '#3f8600' }}>
          Rp {Number(text).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      title: 'Low',
      dataIndex: 'low',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
      render: (text) => (
        <span style={{ color: '#cf1322' }}>
          Rp {Number(text).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      title: 'Close',
      dataIndex: 'close',
      valueType: 'money',
      hideInSearch: true,
      width: 100,
      render: (text) => (
        <span style={{ fontWeight: 'bold' }}>
          Rp {Number(text).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      valueType: 'digit',
      hideInSearch: true,
      width: 120,
      render: (text) => Number(text).toLocaleString('id-ID'),
    },
    {
      title: 'Change',
      hideInSearch: true,
      width: 120,
      render: (_, record, index) => {
        if (index === snap.marketData.length - 1) return '-';
        const prevClose = snap.marketData[index + 1]?.close;
        if (!prevClose) return '-';
        
        const change = record.close - prevClose;
        const changePercent = (change / prevClose) * 100;
        const isPositive = change >= 0;
        
        return (
          <Space>
            <span style={{ color: isPositive ? '#3f8600' : '#cf1322' }}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
            <span style={{ color: isPositive ? '#3f8600' : '#cf1322' }}>
              ({changePercent.toFixed(2)}%)
            </span>
          </Space>
        );
      },
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: 120,
      valueEnum: {
        yahoo: { text: 'Yahoo Finance', status: 'Processing' },
        mirae: { text: 'Mirae Asset', status: 'Success' },
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="Delete this record?"
          onConfirm={() => marketActions.deleteMarketData(record.symbol)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Date', 'Symbol', 'Open', 'High', 'Low', 'Close', 'Volume', 'Source'];
    const data = snap.marketData.map(item => [
      dayjs(item.date).format('YYYY-MM-DD'),
      item.symbol,
      item.open,
      item.high,
      item.low,
      item.close,
      item.volume,
      item.source,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-data-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
  };

  return (
    <ProTable<MarketData>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      dataSource={snap.marketData}
      loading={snap.loading}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 20,
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      dateFormatter="string"
      headerTitle="Market Data"
      options={{
        density: true,
        fullScreen: true,
        reload: () => marketActions.fetchMarketData(),
        setting: true,
      }}
      toolBarRender={() => [
        <Button
          key="export"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Export CSV
        </Button>,
        <Button
          key="fetch"
          type="primary"
          icon={<SyncOutlined />}
          loading={snap.loading}
          onClick={() => marketActions.manualFetchYahoo(snap.selectedSymbol)}
        >
          Fetch Yahoo Data
        </Button>,
      ]}
    />
  );
}