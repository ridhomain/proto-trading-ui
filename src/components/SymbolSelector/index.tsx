import { Select, Space } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { marketStore, marketActions } from '@/stores/market.store';
import { IDX_SYMBOLS, SECTOR_COLORS } from '@/constants/symbols';

export default function SymbolSelector() {
  const snap = useSnapshot(marketStore);

  const handleToggleWatchlist = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (snap.watchlist.includes(symbol)) {
      marketActions.removeFromWatchlist(symbol);
    } else {
      marketActions.addToWatchlist(symbol);
    }
  };

  return (
    <Select
      value={snap.selectedSymbol}
      onChange={(value) => marketActions.setSymbol(value)}
      style={{ width: 300 }}
      placeholder="Select a symbol"
      optionLabelProp="label"
    >
      {IDX_SYMBOLS.map((symbol) => (
        <Select.Option
          key={symbol.value}
          value={symbol.value}
          label={`${symbol.value} - ${symbol.label}`}
        >
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <span>{symbol.value}</span>
              <span style={{ color: '#999' }}>{symbol.label}</span>
              <span
                style={{
                  color: SECTOR_COLORS[symbol.sector] || '#999',
                  fontSize: 12,
                }}
              >
                {symbol.sector}
              </span>
            </Space>
            <span
              onClick={(e) => handleToggleWatchlist(symbol.value, e)}
              style={{ cursor: 'pointer' }}
            >
              {snap.watchlist.includes(symbol.value) ? (
                <StarFilled style={{ color: '#faad14' }} />
              ) : (
                <StarOutlined />
              )}
            </span>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
}