import { proxy } from 'valtio';
import { request } from '@umijs/max';
import { message } from 'antd';

export interface MarketData {
  id: number;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source: 'yahoo' | 'mirae';
  created_at: string;
}

export const marketStore = proxy({
  // Data
  marketData: [] as MarketData[],
  selectedSymbol: 'BBCA.JK',
  dateRange: [null, null] as [string | null, string | null],
  
  // UI State
  loading: false,
  uploading: false,
  uploadProgress: 0,
  
  // Filters
  dataSource: 'yahoo' as 'yahoo' | 'mirae',
  
  // Watchlist
  watchlist: ['BBCA.JK', 'BBRI.JK', 'BMRI.JK'] as string[],
  
  // Stats
  stats: {
    totalRecords: 0,
    lastUpdated: null as string | null,
  },
});

export const marketActions = {
  async fetchMarketData(params?: { symbol?: string; days?: number }) {
    marketStore.loading = true;
    try {
      const response = await request<MarketData[]>('/api/v1/market-data', {
        params: {
          symbol: params?.symbol || marketStore.selectedSymbol,
          days: params?.days || 30,
        },
      });
      marketStore.marketData = response;
      marketStore.stats.totalRecords = response.length;
      marketStore.stats.lastUpdated = new Date().toISOString();
      return response;
    } catch (error) {
      message.error('Failed to fetch market data');
      throw error;
    } finally {
      marketStore.loading = false;
    }
  },

  async manualFetchYahoo(symbol: string) {
    marketStore.loading = true;
    try {
      await request(`/api/v1/market-data/yahoo/${symbol}`, {
        method: 'POST',
      });
      message.success('Yahoo data fetched successfully');
      await this.fetchMarketData();
    } catch (error) {
      message.error('Failed to fetch Yahoo data');
    } finally {
      marketStore.loading = false;
    }
  },

  async uploadCSV(file: File) {
    marketStore.uploading = true;
    marketStore.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('csv', file);
    
    try {
      const response = await request('/api/v1/upload/csv', {
        method: 'POST',
        data: formData,
        requestType: 'form',
      });
      
      message.success('CSV uploaded successfully!');
      await this.fetchMarketData();
      return response;
    } catch (error) {
      message.error('Upload failed');
      throw error;
    } finally {
      marketStore.uploading = false;
      marketStore.uploadProgress = 0;
    }
  },

  async deleteMarketData(symbol: string) {
    try {
      await request(`/api/v1/market-data/${symbol}`, {
        method: 'DELETE',
      });
      message.success('Data deleted successfully');
      await this.fetchMarketData();
    } catch (error) {
      message.error('Failed to delete data');
    }
  },

  setSymbol(symbol: string) {
    marketStore.selectedSymbol = symbol;
    this.fetchMarketData();
  },

  addToWatchlist(symbol: string) {
    if (!marketStore.watchlist.includes(symbol)) {
      marketStore.watchlist.push(symbol);
      message.success(`${symbol} added to watchlist`);
    }
  },

  removeFromWatchlist(symbol: string) {
    const index = marketStore.watchlist.indexOf(symbol);
    if (index > -1) {
      marketStore.watchlist.splice(index, 1);
      message.success(`${symbol} removed from watchlist`);
    }
  },
};