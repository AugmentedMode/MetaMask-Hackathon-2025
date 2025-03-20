// Token-related types
export interface TokenBalance {
  token: string;
  amount: string;
  value_usd: number;
  chain: string;
}

export interface PortfolioData {
  balances: TokenBalance[];
  total_value_usd: number;
}

interface Balance {
  object: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  chainId: number;
}
export interface AccountsAPIBalances {
  count: number;
  balances: Balance[];
  unprocessedNetworks: number[];
}

export interface TokenPrice {
  price: number;
  change_24h: number;
}

export type MarketData<T = number> = {
  id: string;
  price: T;
  marketCap: T;
  allTimeHigh?: T;
  allTimeLow?: T;
  totalVolume?: T;
  high1d?: T;
  low1d?: T;
  circulatingSupply?: T;
  dilutedMarketCap?: T;
  marketCapPercentChange1d?: T;
  priceChange1d: T;
  pricePercentChange1h: T | null;
  pricePercentChange1d: T | null;
  pricePercentChange7d: T | null;
  pricePercentChange14d: T | null;
  pricePercentChange30d: T | null;
  pricePercentChange200d: T | null;
  pricePercentChange1y: T | null;
  bondingCurveProgressPercent?: T | null;
  liquidity?: T | null;
  totalSupply?: T | null;
  holderCount?: T | null;
  isMutable?: boolean | null;
};
export type PricesAPIMarketData = Record<string, MarketData>;

// DeFi-related types
export interface YieldOpportunity {
  protocol: string;
  apy: number;
  type: string; // e.g., "staking", "lending", "farming"
}

// Transaction-related types
export interface Transaction {
  hash: string;
  type: string;
  timestamp: string;
  gas_fee_usd?: number;
  chain: string;
  value_usd?: number;
  // Depending on transaction type
  token?: string;
  from_token?: string;
  to_token?: string;
  amount?: string;
  to_address?: string;
  from_address?: string;
  spender?: string;
}

// Gas analysis types
export interface GasByType {
  count: number;
  total_usd: number;
  average_usd: number;
}

export interface GasPrice {
  gwei: number;
  estimated_time: string;
  usd_for_transfer: number;
}

export interface GasAnalysis {
  total_gas_spent_usd: number;
  transaction_count: number;
  average_gas_per_tx_usd: number;
  highest_gas_tx: {
    hash: string;
    gas_fee_usd: number;
    timestamp: string;
    type: string;
  };
  gas_by_type: {
    [type: string]: GasByType;
  };
  optimization_tips: string[];
  current_gas_prices: {
    slow: GasPrice;
    average: GasPrice;
    fast: GasPrice;
  };
}

// Portfolio analysis types
export interface AssetAllocation {
  percentage: number;
  value_usd: number;
}

export interface TokenPerformance {
  token: string;
  change_30d_pct: number;
  change_30d_usd: number;
}

export interface PortfolioAnalysis {
  diversification: {
    by_asset_type: {
      [type: string]: AssetAllocation;
    };
    by_chain: {
      [chain: string]: AssetAllocation;
    };
    by_token: {
      token: string;
      percentage: number;
      value_usd: number;
    }[];
    risk_assessment: string;
    concentration_risk: string;
  };
  performance: {
    overall: {
      change_30d_pct: number;
      change_30d_usd: number;
    };
    by_token: TokenPerformance[];
    best_performer: {
      token: string;
      change_30d_pct: number;
    };
    worst_performer: {
      token: string;
      change_30d_pct: number;
    };
  };
  suggestions: string[];
}

// Identity resolution types
export interface IdentityInfo {
  type: 'ENS' | 'Lens' | 'Farcaster';
  identifier: string;
  address: string;
}

// API response type for tools
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 