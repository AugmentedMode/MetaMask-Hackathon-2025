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

// Token symbol to address mapping - common tokens
const TOKEN_ADDRESSES: Record<string, string> = {
  // Native tokens
  'ETH': 'ETH', // Special marker for native ETH
  'MATIC': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  
  // Stablecoins
  'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  
  // DeFi tokens
  'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  'AAVE': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  'COMP': '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  'LINK': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  'SNX': '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  'CRV': '0xD533a949740bb3306d119CC777fa900bA034cd52',
  'MKR': '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  'SUSHI': '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302',
  
  // Popular tokens
  'WBTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  'APE': '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  'SHIB': '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  'LDO': '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32'
};

// Get token address by symbol
export const getTokenAddressBySymbol = (symbol: string): string | null => {
  // Handle ETH specially - it's not an ERC20 token
  if (symbol.toUpperCase() === 'ETH') {
    return 'ETH';
  }
  
  // Try to find the address by symbol
  const address = TOKEN_ADDRESSES[symbol.toUpperCase()];
  if (address) {
    return address;
  }
  
  // If we couldn't find it in our mapping, return null
  console.warn(`Token address not found for symbol: ${symbol}`);
  return null;
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

// Generate token swap link
export interface SwapLinkOptions {
  fromToken: string;
  toToken: string;
  amount?: string; 
  address?: string;
  platform: 'metamask' | 'uniswap';
  chain?: string;
}

export interface SwapLinkResult {
  url: string;
  platform: string;
  chain: string;
}

export const getSwapLink = async (options: SwapLinkOptions): Promise<SwapLinkResult> => {
  const { fromToken, toToken, amount, address, platform, chain = 'Ethereum' } = options;
  
  // Get token addresses if needed for Uniswap
  const fromTokenAddress = platform === 'uniswap' ? getTokenAddressBySymbol(fromToken) || fromToken : fromToken;
  const toTokenAddress = platform === 'uniswap' ? getTokenAddressBySymbol(toToken) || toToken : toToken;
  
  if (USE_MOCK_DATA) {
    // Mock data for testing
    const platformName = platform === 'metamask' ? 'MetaMask' : 'Uniswap';
    return {
      url: platform === 'metamask'
        ? `https://portfolio.metamask.io/swap?sourceToken=${fromToken}&destinationToken=${toToken}${amount ? `&amount=${amount}` : ''}`
        : `https://app.uniswap.org/swap?inputCurrency=${fromTokenAddress}&outputCurrency=${toTokenAddress}${amount ? `&exactAmount=${amount}&exactField=input` : ''}`,
      platform: platformName,
      chain
    };
  }
  
  try {
    const queryParams = new URLSearchParams();
    
    if (platform === 'metamask') {
      queryParams.append('sourceToken', fromToken);
      queryParams.append('destinationToken', toToken);
      if (amount) queryParams.append('amount', amount);
      if (address) queryParams.append('address', address);
      
      const url = `https://portfolio.metamask.io/swap?${queryParams.toString()}`;
      return { url, platform: 'MetaMask', chain };
    } else {
      // Uniswap - use addresses instead of symbols
      queryParams.append('inputCurrency', fromTokenAddress);
      queryParams.append('outputCurrency', toTokenAddress);
      if (amount) {
        queryParams.append('exactAmount', amount);
        queryParams.append('exactField', 'input'); // Required by Uniswap when exactAmount is set
      }
      
      const url = `https://app.uniswap.org/swap?${queryParams.toString()}`;
      return { url, platform: 'Uniswap', chain };
    }
  } catch (error) {
    console.error('Error generating swap link:', error);
    // Fallback to a basic URL
    return {
      url: platform === 'metamask'
        ? 'https://portfolio.metamask.io/swap'
        : 'https://app.uniswap.org/swap',
      platform: platform === 'metamask' ? 'MetaMask' : 'Uniswap',
      chain
    };
  }
};