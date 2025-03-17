import {
  PortfolioData,
  TokenPrice,
  YieldOpportunity,
  Transaction,
  GasAnalysis,
  PortfolioAnalysis,
  IdentityInfo,
  ApiResponse,
} from '../types';
import { AGENT_CONFIG, USE_MOCK_DATA } from '../config';
import * as mockData from './mockData';

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

// Helper to get data with caching
const getCachedData = async <T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < ttlSeconds * 1000) {
    return cached.data as T;
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: now });
  return data;
};

// Fetch portfolio balances
export const getPortfolioBalances = async (address?: string): Promise<PortfolioData> => {
  if (USE_MOCK_DATA) {
    return mockData.mockPortfolioData;
  }
  
  return getCachedData(
    `balances:${address || 'default'}`,
    AGENT_CONFIG.cacheTTL.balances,
    async () => {
      try {
        const response = await fetch(`${AGENT_CONFIG.endpoints.balances}?address=${address || ''}`);
        const data: ApiResponse<PortfolioData> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch portfolio balances');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching portfolio balances:', error);
        // Fallback to mock data if real API fails
        return mockData.mockPortfolioData;
      }
    }
  );
};

// Fetch token price
export const getTokenPrice = async (token: string, chain?: string): Promise<TokenPrice> => {
  if (USE_MOCK_DATA) {
    return mockData.mockTokenPrices[token] || { price: 0, change_24h: 0 };
  }
  
  return getCachedData(
    `price:${token}:${chain || 'default'}`,
    AGENT_CONFIG.cacheTTL.prices,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.prices}?token=${token}${chain ? `&chain=${chain}` : ''}`
        );
        const data: ApiResponse<TokenPrice> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch token price');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching token price:', error);
        // Fallback to mock data if real API fails
        return mockData.mockTokenPrices[token] || { price: 0, change_24h: 0 };
      }
    }
  );
};

// Fetch DeFi yields
export const getDefiYields = async (token: string): Promise<YieldOpportunity[]> => {
  if (USE_MOCK_DATA) {
    return mockData.mockDefiYields[token] || [];
  }
  
  return getCachedData(
    `yields:${token}`,
    AGENT_CONFIG.cacheTTL.defi,
    async () => {
      try {
        const response = await fetch(`${AGENT_CONFIG.endpoints.defi}/yields?token=${token}`);
        const data: ApiResponse<YieldOpportunity[]> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch DeFi yields');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching DeFi yields:', error);
        // Fallback to mock data if real API fails
        return mockData.mockDefiYields[token] || [];
      }
    }
  );
};

// Fetch transaction history
export const getTransactionHistory = async (
  address?: string,
  chain: string = 'Ethereum',
  limit: number = 5
): Promise<Transaction[]> => {
  if (USE_MOCK_DATA) {
    return (mockData.mockTransactions[chain] || []).slice(0, limit);
  }
  
  return getCachedData(
    `transactions:${address || 'default'}:${chain}:${limit}`,
    AGENT_CONFIG.cacheTTL.transactions,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.transactions}?${address ? `address=${address}&` : ''}chain=${chain}&limit=${limit}`
        );
        const data: ApiResponse<Transaction[]> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch transaction history');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        // Fallback to mock data if real API fails
        return (mockData.mockTransactions[chain] || []).slice(0, limit);
      }
    }
  );
};

// Fetch gas usage analysis
export const getGasAnalysis = async (
  address?: string,
  chain: string = 'Ethereum',
  period: string = 'month'
): Promise<GasAnalysis> => {
  if (USE_MOCK_DATA) {
    return mockData.mockGasAnalysis;
  }
  
  return getCachedData(
    `gas:${address || 'default'}:${chain}:${period}`,
    AGENT_CONFIG.cacheTTL.transactions,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.transactions}/gas?${address ? `address=${address}&` : ''}chain=${chain}&period=${period}`
        );
        const data: ApiResponse<GasAnalysis> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch gas analysis');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching gas analysis:', error);
        // Fallback to mock data if real API fails
        return mockData.mockGasAnalysis;
      }
    }
  );
};

// Fetch portfolio analysis
export const getPortfolioAnalysis = async (
  address?: string,
  period: string = 'month'
): Promise<PortfolioAnalysis> => {
  if (USE_MOCK_DATA) {
    return mockData.mockPortfolioAnalysis;
  }
  
  return getCachedData(
    `portfolio:${address || 'default'}:${period}`,
    AGENT_CONFIG.cacheTTL.balances,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.balances}/analysis?${address ? `address=${address}&` : ''}period=${period}`
        );
        const data: ApiResponse<PortfolioAnalysis> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch portfolio analysis');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching portfolio analysis:', error);
        // Fallback to mock data if real API fails
        return mockData.mockPortfolioAnalysis;
      }
    }
  );
};

// Search historical transactions
export const searchHistoricalTransactions = async (
  params: {
    address?: string;
    token?: string;
    type?: string;
    from_date?: string;
    to_date?: string;
  }
): Promise<Transaction[]> => {
  if (USE_MOCK_DATA) {
    let results = [...mockData.mockHistoricalTransactions];
    
    if (params.token) {
      results = results.filter(tx => 
        (tx.token === params.token) || 
        (tx.from_token === params.token) || 
        (tx.to_token === params.token)
      );
    }
    
    if (params.type) {
      results = results.filter(tx => tx.type === params.type);
    }
    
    if (params.from_date) {
      const fromTimestamp = new Date(params.from_date).getTime();
      results = results.filter(tx => new Date(tx.timestamp).getTime() >= fromTimestamp);
    }
    
    if (params.to_date) {
      const toTimestamp = new Date(params.to_date).getTime();
      results = results.filter(tx => new Date(tx.timestamp).getTime() <= toTimestamp);
    }
    
    return results;
  }
  
  return getCachedData(
    `transactions:search:${JSON.stringify(params)}`,
    AGENT_CONFIG.cacheTTL.transactions,
    async () => {
      try {
        // Build query string from params
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.transactions}/search?${queryParams.toString()}`
        );
        const data: ApiResponse<Transaction[]> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to search historical transactions');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error searching historical transactions:', error);
        // Apply filters to mock data as fallback
        let results = [...mockData.mockHistoricalTransactions];
        
        if (params.token) {
          results = results.filter(tx => 
            (tx.token === params.token) || 
            (tx.from_token === params.token) || 
            (tx.to_token === params.token)
          );
        }
        
        if (params.type) {
          results = results.filter(tx => tx.type === params.type);
        }
        
        if (params.from_date) {
          const fromTimestamp = new Date(params.from_date).getTime();
          results = results.filter(tx => new Date(tx.timestamp).getTime() >= fromTimestamp);
        }
        
        if (params.to_date) {
          const toTimestamp = new Date(params.to_date).getTime();
          results = results.filter(tx => new Date(tx.timestamp).getTime() <= toTimestamp);
        }
        
        return results;
      }
    }
  );
};

// Resolve identity (ENS, Lens, etc.)
export const resolveIdentity = async (identifier: string): Promise<IdentityInfo | null> => {
  if (USE_MOCK_DATA) {
    return mockData.mockIdentities.find(id => id.identifier === identifier) || null;
  }
  
  return getCachedData(
    `identity:${identifier}`,
    AGENT_CONFIG.cacheTTL.identities,
    async () => {
      try {
        const response = await fetch(`${AGENT_CONFIG.endpoints.identities}?identifier=${identifier}`);
        const data: ApiResponse<IdentityInfo> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to resolve identity');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error resolving identity:', error);
        // Fallback to mock data if real API fails
        return mockData.mockIdentities.find(id => id.identifier === identifier) || null;
      }
    }
  );
};

// Get protocols by TVL change
export const getProtocolsByTVLChange = async (): Promise<typeof mockData.mockTVLData> => {
  if (USE_MOCK_DATA) {
    return mockData.mockTVLData;
  }
  
  return getCachedData(
    'tvl:protocols',
    AGENT_CONFIG.cacheTTL.defi,
    async () => {
      try {
        const response = await fetch(`${AGENT_CONFIG.endpoints.defi}/tvl`);
        const data: ApiResponse<typeof mockData.mockTVLData> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch protocol TVL data');
        }
        
        return data.data!;
      } catch (error) {
        console.error('Error fetching protocol TVL data:', error);
        // Fallback to mock data if real API fails
        return mockData.mockTVLData;
      }
    }
  );
}; 