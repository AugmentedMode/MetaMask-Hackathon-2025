import {
  PortfolioData,
  TokenPrice,
  YieldOpportunity,
  Transaction,
  GasAnalysis,
  PortfolioAnalysis,
  IdentityInfo,
  ApiResponse,
  AccountsAPIBalances,
  PricesAPIMarketData,
  AccountsAPITransactions,
} from "../types";
import { AGENT_CONFIG, USE_MOCK_DATA } from '../config';
import * as mockData from './mockData';
import { analyzeGasFees, formatTransactionData, fetchAllTransactions } from '../utils/dataUtils';


// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

const deriveChainId = (chainName: string) => {
  switch (chainName) {
    case "Ethereum":
      return 1;
    case "Polygon":
      return 137;
    case "Arbitrum":
      return 42161;
    case "Optimism":
      return 10;
    case "Base":
      return 8453;
    case "BNB Chain":
      return 56;
    case "Linea":
      return 59144;
    default:
      return 1;
  }
};

// Helper to get data with caching
const getCachedData = async <T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
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
export const getPortfolioBalances = async (
  address: string,
  chainName = "Ethereum",
): Promise<AccountsAPIBalances | undefined> => {
  if (USE_MOCK_DATA) {
    return mockData.mockPortfolioData;
  }
  if (!address) {
    console.error("Address is required to fetch portfolio balances");
    return;
  }
  console.log('Using getPortfolioBalances tool.');

  const chainId = deriveChainId(chainName);
  return getCachedData(
    `balances:${address || "default"}`,
    AGENT_CONFIG.cacheTTL.balances,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.balances}/${address}/balances?networks=${chainId}`,
        );
        if (!response.ok || response.status !== 200) {
          throw new Error("Failed to fetch asset balances");
        }
        const data: AccountsAPIBalances = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching portfolio balances:", error);

        return mockData.mockPortfolioData;
      }
    },
  );
};

// Fetch token price
export const getTokenPrice = async (
  token: string,
  chain?: string,
): Promise<PricesAPIMarketData | undefined> => {
  if (USE_MOCK_DATA) {
    return mockData.mockTokenPrices;
  }

  console.log('Using getTokenPrice tool.');

  const chainId = deriveChainId(chain || "Ethereum");
  return getCachedData(
    `price:${token}:${chain || "default"}`,
    AGENT_CONFIG.cacheTTL.prices,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.prices}/${chainId}/spot-prices?includeMarketData=true&tokenAddresses=${token}`,
        );
        if (!response.ok || response.status !== 200) {
          throw new Error("Failed to fetch token price");
        }
        const data: PricesAPIMarketData = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching token price:", error);
        // Fallback to mock data if real API fails
        return mockData.mockTokenPrices;
      }
    },
  );
};

// Fetch DeFi yields
export const getDefiYields = async (
  token: string,
): Promise<YieldOpportunity[]> => {
  if (USE_MOCK_DATA) {
    return mockData.mockDefiYields[token] || [];
  }
  console.log('Using getDefiYields tool.');

  return getCachedData(
    `yields:${token}`,
    AGENT_CONFIG.cacheTTL.defi,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.defi}/yields?token=${token}`,
        );
        const data: ApiResponse<YieldOpportunity[]> = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch DeFi yields");
        }

        return data.data!;
      } catch (error) {
        console.error("Error fetching DeFi yields:", error);
        // Fallback to mock data if real API fails
        return mockData.mockDefiYields[token] || [];
      }
    },
  );
};

// Fetch transaction history
export const getTransactionHistory = async (
  address?: string,
  chain: string = "Ethereum",
  limit: number = 50,
): Promise<AccountsAPITransactions> => {
  if (USE_MOCK_DATA) {
    return {
      ...mockData.mockTransactions,
      data: (mockData.mockTransactions.data || []).slice(0, limit),
    };
  }
  const chainId = deriveChainId(chain);
  console.log('Using getTransactionHistory tool.');

  return getCachedData(
    `transactions:${address || "default"}:${chain}:${limit}`,
    AGENT_CONFIG.cacheTTL.transactions,
    async () => {
      try {
        const response = await fetch(
          `${AGENT_CONFIG.endpoints.transactions}/${address}/transactions?includeTxMetadata=true&networks=${chainId}&limit=${limit}`,
        );

        if (!response.ok || response.status !== 200) {
          throw new Error("Failed to fetch tx history");
        }
        const data: AccountsAPITransactions = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        // Fallback to mock data if real API fails
        return {
          ...mockData.mockTransactions,
          data: (mockData.mockTransactions.data || []).slice(0, limit),
        };
      }
    },
  );
};

// Fetch gas usage analysis
export const getGasAnalysis = async (
  address: string,
  chain: string = 'Ethereum',
  period: string = 'month'
): Promise<GasAnalysis> => {
  if (USE_MOCK_DATA) {
    return mockData.mockGasAnalysis;
  }

  console.log('Using getGasAnalysis tool.');
  const chainId = deriveChainId(chain);
  
  return getCachedData(
    `gas:${address}:${chain}:${period}`,
    AGENT_CONFIG.cacheTTL.transactions,
    async () => {
      try {
        const allTransactions = await fetchAllTransactions(address, chainId)
        const formattedTransactionsList = await formatTransactionData(address, allTransactions, period);
        
        return analyzeGasFees(formattedTransactionsList);
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

  console.log('Using getPortfolioAnalysis tool.');
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
  
  console.log('Using resolveIdentity tool.');

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
  
  console.log('Using getProtocolsByTVLChange tool.');
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