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
        const data: AccountsAPIBalances = await response.json();

        if (!response.ok) {
          throw new Error(await response.text() || "Failed to fetch portfolio balances");
        }

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
  period: number = 2592000
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

// Options for bridge link
export interface BridgeLinkOptions {
  amount?: string;
  address?: string;
  l2Chain: string;
}

// Result for bridge link
export interface BridgeLinkResult {
  url: string;
  estimatedGas: string;
  estimatedTime: string;
}

// Get link for bridging ETH to L2s
export const getBridgeLink = async (options: BridgeLinkOptions): Promise<BridgeLinkResult> => {
  const { amount, address, l2Chain } = options;
  
  // Normalize chain name to lowercase for comparison
  const chain = l2Chain.toLowerCase();
  
  // Define bridge URLs for various L2s
  const bridgeUrls: Record<string, string> = {
    'linea': 'https://bridge.linea.build',
    'arbitrum': 'https://bridge.arbitrum.io',
    'optimism': 'https://app.optimism.io/bridge',
    'base': 'https://bridge.base.org',
    'zksync': 'https://portal.zksync.io/bridge',
    'polygon': 'https://wallet.polygon.technology/bridge',
  };
  
  // Get base URL for the specified chain (default to Linea if not found)
  const baseUrl = bridgeUrls[chain] || bridgeUrls['linea'];
  
  // Estimated times and gas costs vary by L2
  const estimatedGas: Record<string, string> = {
    'linea': '0.002 ETH',
    'arbitrum': '0.003 ETH',
    'optimism': '0.0015 ETH',
    'base': '0.0018 ETH',
    'zksync': '0.0022 ETH',
    'polygon': '0.0025 ETH',
  };
  
  const estimatedTimes: Record<string, string> = {
    'linea': '10-15 minutes',
    'arbitrum': '10-20 minutes',
    'optimism': '5-10 minutes',
    'base': '5-10 minutes',
    'zksync': '15-25 minutes',
    'polygon': '7-12 minutes',
  };
  
  // Check if using mock data
  if (USE_MOCK_DATA) {
    // Mock data for testing
    return {
      url: `${baseUrl}?sourceToken=ETH&amount=${amount || '0.1'}&walletAddress=${address || '0x'}`,
      estimatedGas: estimatedGas[chain] || "0.002 ETH",
      estimatedTime: estimatedTimes[chain] || "10-15 minutes"
    };
  }
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (amount) queryParams.append('amount', amount);
    if (address) queryParams.append('walletAddress', address);
    
    // Get estimated gas and time for the specified chain
    const gasEstimate = estimatedGas[chain] || "0.002 ETH";
    const timeEstimate = estimatedTimes[chain] || "10-15 minutes";
    
    const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
    
    return {
      url,
      estimatedGas: gasEstimate,
      estimatedTime: timeEstimate
    };
  } catch (error) {
    console.error(`Error generating ${l2Chain} bridge link:`, error);
    // Fallback to a basic URL
    return {
      url: baseUrl,
      estimatedGas: "Unknown",
      estimatedTime: "Unknown"
    };
  }
};

// Keep the old function for backward compatibility
export const getLineaBridgeLink = async (options: Omit<BridgeLinkOptions, 'l2Chain'>): Promise<BridgeLinkResult> => {
  return getBridgeLink({ ...options, l2Chain: 'linea' });
};

// Options for bridge and swap link
export interface BridgeAndSwapLinkOptions extends BridgeLinkOptions {
  targetToken: string;
}

// Get link for bridging ETH to an L2 and swapping to another token
export const getBridgeAndSwapLink = async (options: BridgeAndSwapLinkOptions): Promise<BridgeLinkResult> => {
  const { amount, address, l2Chain, targetToken } = options;
  
  // Normalize chain name to lowercase for comparison
  const chain = l2Chain.toLowerCase();
  
  // Define bridge+swap URLs for various L2s
  // In a real implementation, these would point to specialized bridge+swap services or include additional parameters
  const bridgeAndSwapUrls: Record<string, string> = {
    'arbitrum': 'https://bridge.arbitrum.io/?swapTo=',
    'optimism': 'https://app.optimism.io/bridge/deposit?swapTo=',
    'base': 'https://bridge.base.org/?swapTo=',
    'linea': 'https://bridge.linea.build/?swapTo=',
    'zksync': 'https://portal.zksync.io/bridge?swapTo=',
    'polygon': 'https://wallet.polygon.technology/bridge/?swapTo=',
  };
  
  // Get base URL for the specified chain (default to Arbitrum if not found)
  const baseUrl = bridgeAndSwapUrls[chain] || bridgeAndSwapUrls['arbitrum'];
  
  // Estimated gas costs are higher for bridge+swap
  const estimatedGas: Record<string, string> = {
    'arbitrum': '0.0045 ETH',
    'optimism': '0.0025 ETH',
    'base': '0.0028 ETH',
    'linea': '0.003 ETH',
    'zksync': '0.0032 ETH',
    'polygon': '0.0035 ETH',
  };
  
  // Estimated times are longer for bridge+swap
  const estimatedTimes: Record<string, string> = {
    'arbitrum': '15-25 minutes',
    'optimism': '8-15 minutes',
    'base': '8-15 minutes',
    'linea': '15-20 minutes',
    'zksync': '20-30 minutes',
    'polygon': '10-15 minutes',
  };
  
  // Check if using mock data
  if (USE_MOCK_DATA) {
    // Mock data for testing
    return {
      url: `${baseUrl}${targetToken}${amount ? `&amount=${amount}` : ''}${address ? `&walletAddress=${address}` : ''}`,
      estimatedGas: estimatedGas[chain] || "0.004 ETH",
      estimatedTime: estimatedTimes[chain] || "15-25 minutes"
    };
  }
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    queryParams.append('swapTo', targetToken);
    if (amount) queryParams.append('amount', amount);
    if (address) queryParams.append('walletAddress', address);
    
    // Get estimated gas and time for the specified chain
    const gasEstimate = estimatedGas[chain] || "0.004 ETH";
    const timeEstimate = estimatedTimes[chain] || "15-25 minutes";
    
    const url = `${baseUrl}${targetToken}${queryParams.toString() ? `&${queryParams.toString()}` : ''}`;
    
    return {
      url,
      estimatedGas: gasEstimate,
      estimatedTime: timeEstimate
    };
  } catch (error) {
    console.error(`Error generating ${l2Chain} bridge and swap link:`, error);
    // Fallback to a basic URL
    return {
      url: `${baseUrl}${targetToken}`,
      estimatedGas: "Unknown",
      estimatedTime: "Unknown"
    };
  }
};