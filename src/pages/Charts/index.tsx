import { ProCard } from '@ant-design/pro-components';
import { Space, DatePicker, Radio, Empty, Spin } from 'antd';
import { Stock } from '@ant-design/charts';
import { useSnapshot } from 'valtio';
import { useEffect, useState } from 'react';
import { marketStore, marketActions } from '@/stores/market.store';
import SymbolSelector from '@/components/SymbolSelector';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function ChartsPage() {
  const snap = useSnapshot(marketStore);
  const [timeRange, setTimeRange] = useState('1M');

  useEffect(() => {
    marketActions.fetchMarketData();
  }, []);

  // Convert data to candlestick format
  const chartData = snap.marketData
    .slice()
    .reverse()
    .map((item) => ({
      date: item.date,
      open: item.open,
      close: item.close,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }));

  const stockConfig = {
    data: chartData,
    xField: 'date',
    yField: ['open', 'close', 'high', 'low'],
    meta: {
      date: {
        alias: 'Date',
        formatter: (v: string) => dayjs(v).format('MM/DD'),
      },
      open: { alias: 'Open' },
      close: { alias: 'Close' },
      high: { alias: 'High' },
      low: { alias: 'Low' },
      volume: { alias: 'Volume' },
    },
    tooltip: {
      crosshairs: {
        type: 'xy',
      },
      showCrosshairs: true,
      shared: true,
    },
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    let days = 30;
    switch (value) {
      case '1W':
        days = 7;
        break;
      case '1M':
        days = 30;
        break;
      case '3M':
        days = 90;
        break;
      case '1Y':
        days = 365;
        break;
    }
    marketActions.fetchMarketData({ days });
  };

  return (
    <ProCard
      ghost
      title="Price Charts"
      extra={
        <Space>
          <Radio.Group
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <Radio.Button value="1W">1W</Radio.Button>
            <Radio.Button value="1M">1M</Radio.Button>
            <Radio.Button value="3M">3M</Radio.Button>
            <Radio.Button value="1Y">1Y</Radio.Button>
          </Radio.Group>
          <SymbolSelector />
        </Space>
      }
    >
      <Spin spinning={snap.loading}>
        <ProCard>
          {chartData.length > 0 ? (
            <Stock {...stockConfig} height={500} />
          ) : (
            <Empty
              description="No data available"
              style={{ padding: '100px 0' }}
            />
          )}
        </ProCard>

        <ProCard
          title="Trading Statistics"
          style={{ marginTop: 16 }}
          gutter={16}
        >
          <ProCard colSpan={6}>
            <div>
              <div style={{ color: '#999' }}>Highest Price</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3f8600' }}>
                Rp {Math.max(...chartData.map(d => d.high)).toLocaleString('id-ID')}
              </div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div>
              <div style={{ color: '#999' }}>Lowest Price</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#cf1322' }}>
                Rp {Math.min(...chartData.map(d => d.low)).toLocaleString('id-ID')}
              </div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div>
              <div style={{ color: '#999' }}>Average Volume</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {Math.round(
                  chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length
                ).toLocaleString('id-ID')}
              </div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div>
              <div style={{ color: '#999' }}>Data Points</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {chartData.length}
              </div>
            </div>
          </ProCard>
        </ProCard>
      </Spin>
    </ProCard>
  );
}