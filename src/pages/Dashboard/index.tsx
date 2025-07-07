import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Line, Column } from '@ant-design/charts';
import { useSnapshot } from 'valtio';
import { useEffect } from 'react';
import { Space, Tag, Spin } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StockOutlined,
  StarFilled
} from '@ant-design/icons';
import { marketStore, marketActions } from '@/stores/market.store';
import SymbolSelector from '@/components/SymbolSelector';
import dayjs from 'dayjs';

const { Statistic, Divider } = StatisticCard;

export default function Dashboard() {
  const snap = useSnapshot(marketStore);

  useEffect(() => {
    marketActions.fetchMarketData();
  }, []);

  // Calculate statistics
  const latestData = snap.marketData[0];
  const previousData = snap.marketData[1];
  const priceChange = latestData && previousData 
    ? latestData.close - previousData.close 
    : 0;
  const priceChangePercent = previousData?.close 
    ? (priceChange / previousData.close) * 100 
    : 0;

  // Prepare chart data
  const chartData = snap.marketData
    .slice()
    .reverse()
    .map((item) => ({
      date: dayjs(item.date).format('MM/DD'),
      value: item.close,
      volume: item.volume,
    }));

  const lineConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: 'Close Price',
          value: `Rp ${datum.value.toLocaleString('id-ID')}`,
        };
      },
    },
  };

  const columnConfig = {
    data: chartData.slice(-7),
    xField: 'date',
    yField: 'volume',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <ProCard
      ghost
      gutter={[16, 16]}
      title={
        <Space>
          <StockOutlined />
          Market Overview
        </Space>
      }
      extra={<SymbolSelector />}
    >
      <Spin spinning={snap.loading}>
        <ProCard colSpan={24} gutter={16}>
          <StatisticCard.Group direction="row">
            <StatisticCard
              statistic={{
                title: 'Latest Price',
                value: latestData?.close || 0,
                precision: 2,
                prefix: 'Rp',
                description: (
                  <Statistic
                    value={Math.abs(priceChangePercent)}
                    precision={2}
                    suffix="%"
                    trend={priceChange >= 0 ? 'up' : 'down'}
                    prefix={
                      priceChange >= 0 ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                  />
                ),
              }}
            />
            <Divider type="vertical" />
            <StatisticCard
              statistic={{
                title: 'Volume',
                value: latestData?.volume || 0,
                suffix: 'shares',
                description: 'Daily trading volume',
              }}
            />
            <Divider type="vertical" />
            <StatisticCard
              statistic={{
                title: 'Day Range',
                value: latestData ? `${latestData.low} - ${latestData.high}` : '-',
                prefix: 'Rp',
                description: 'Today\'s trading range',
              }}
            />
            <Divider type="vertical" />
            <StatisticCard
              statistic={{
                title: 'Data Source',
                value: latestData?.source || 'N/A',
                description: 'Last updated',
                formatter: (value) => (
                  <Tag color={value === 'yahoo' ? 'blue' : 'green'}>
                    {value === 'yahoo' ? 'Yahoo Finance' : 'Mirae Asset'}
                  </Tag>
                ),
              }}
            />
          </StatisticCard.Group>
        </ProCard>

        <ProCard title="Price Trend" colSpan={16} style={{ marginTop: 16 }}>
          {chartData.length > 0 ? (
            <Line {...lineConfig} height={300} />
          ) : (
            <div style={{ textAlign: 'center', padding: 50 }}>
              No data available
            </div>
          )}
        </ProCard>

        <ProCard title="Volume (Last 7 Days)" colSpan={8} style={{ marginTop: 16 }}>
          {chartData.length > 0 ? (
            <Column {...columnConfig} height={300} />
          ) : (
            <div style={{ textAlign: 'center', padding: 50 }}>
              No data available
            </div>
          )}
        </ProCard>

        <ProCard title="Watchlist" colSpan={24} style={{ marginTop: 16 }}>
          <Space wrap>
            {snap.watchlist.map((symbol) => (
              <Tag
                key={symbol}
                icon={<StarFilled />}
                color="gold"
                style={{ cursor: 'pointer' }}
                onClick={() => marketActions.setSymbol(symbol)}
              >
                {symbol}
              </Tag>
            ))}
          </Space>
        </ProCard>
      </Spin>
    </ProCard>
  );
}