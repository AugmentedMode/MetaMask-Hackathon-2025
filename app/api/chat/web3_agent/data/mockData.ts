import {
  PortfolioData,
  TokenPrice,
  YieldOpportunity,
  Transaction,
  GasAnalysis,
  PortfolioAnalysis,
  IdentityInfo,
} from '../types';

// Mock data for development and testing

// Portfolio balances mock data
export const mockPortfolioData: PortfolioData = {
  balances: [
    { token: "ETH", amount: "1.45", value_usd: 4350, chain: "Ethereum" },
    { token: "MATIC", amount: "1200", value_usd: 720, chain: "Polygon" },
    { token: "LINK", amount: "50", value_usd: 600, chain: "Ethereum" },
    { token: "UNI", amount: "30", value_usd: 150, chain: "Ethereum" },
    { token: "FIL", amount: "20", value_usd: 100, chain: "Filecoin" },
  ],
  total_value_usd: 5920,
};

// Token prices mock data
export const mockTokenPrices: Record<string, TokenPrice> = {
  ETH: { price: 3000, change_24h: 2.5 },
  BTC: { price: 60000, change_24h: 1.2 },
  MATIC: { price: 0.6, change_24h: -1.5 },
  LINK: { price: 12, change_24h: 3.2 },
  UNI: { price: 5, change_24h: -0.8 },
  FIL: { price: 5, change_24h: 5.3 },
};

// DeFi yields mock data
export const mockDefiYields: Record<string, YieldOpportunity[]> = {
  ETH: [
    { protocol: "Lido", apy: 3.5, type: "staking" },
    { protocol: "Rocket Pool", apy: 3.2, type: "staking" },
    { protocol: "Aave", apy: 0.8, type: "lending" },
  ],
  MATIC: [
    { protocol: "Polygon Staking", apy: 5.1, type: "staking" },
    { protocol: "Aave", apy: 1.2, type: "lending" },
  ],
  FIL: [
    { protocol: "Filecoin Staking", apy: 7.8, type: "staking" },
    { protocol: "Venus", apy: 2.3, type: "lending" },
  ],
};

// Transaction history mock data
export const mockTransactions: Record<string, Transaction[]> = {
  Ethereum: [
    { hash: "0x1234...", type: "swap", from_token: "ETH", to_token: "USDC", amount: "0.5", value_usd: 1500, timestamp: "2024-03-15T10:30:00Z", gas_fee_usd: 15, chain: "Ethereum" },
    { hash: "0x2345...", type: "transfer", token: "ETH", to_address: "0xabcd...", amount: "0.2", value_usd: 600, timestamp: "2024-03-10T14:20:00Z", gas_fee_usd: 8, chain: "Ethereum" },
    { hash: "0x3456...", type: "approve", token: "UNI", spender: "Uniswap V3", timestamp: "2024-03-08T09:15:00Z", gas_fee_usd: 12, chain: "Ethereum" },
    { hash: "0x4567...", type: "swap", from_token: "USDC", to_token: "ETH", amount: "2000", value_usd: 2000, timestamp: "2024-03-05T16:45:00Z", gas_fee_usd: 20, chain: "Ethereum" },
    { hash: "0x5678...", type: "receive", token: "ETH", from_address: "0xefgh...", amount: "1.0", value_usd: 3000, timestamp: "2024-03-01T11:10:00Z", gas_fee_usd: 0, chain: "Ethereum" },
  ],
  Polygon: [
    { hash: "0x6789...", type: "swap", from_token: "MATIC", to_token: "USDC", amount: "500", value_usd: 300, timestamp: "2024-03-12T08:25:00Z", gas_fee_usd: 0.5, chain: "Polygon" },
    { hash: "0x7890...", type: "transfer", token: "MATIC", to_address: "0xijkl...", amount: "200", value_usd: 120, timestamp: "2024-03-07T13:40:00Z", gas_fee_usd: 0.3, chain: "Polygon" },
    { hash: "0x8901...", type: "swap", from_token: "USDC", to_token: "WETH", amount: "400", value_usd: 400, timestamp: "2024-03-03T15:55:00Z", gas_fee_usd: 0.4, chain: "Polygon" },
  ],
};

// Historical transactions for searching
export const mockHistoricalTransactions: Transaction[] = [
  // 2024 transactions
  { hash: "0x1234...", chain: "Ethereum", type: "swap", from_token: "ETH", to_token: "USDC", amount: "0.5", value_usd: 1500, timestamp: "2024-03-15T10:30:00Z", gas_fee_usd: 15 },
  { hash: "0x2345...", chain: "Ethereum", type: "transfer", token: "ETH", to_address: "0xabcd...", amount: "0.2", value_usd: 600, timestamp: "2024-03-10T14:20:00Z", gas_fee_usd: 8 },
  { hash: "0x6789...", chain: "Polygon", type: "swap", from_token: "MATIC", to_token: "USDC", amount: "500", value_usd: 300, timestamp: "2024-03-12T08:25:00Z", gas_fee_usd: 0.5 },
  
  // 2023 transactions
  { hash: "0xaaaa...", chain: "Ethereum", type: "swap", from_token: "USDC", to_token: "LINK", amount: "1000", value_usd: 1000, timestamp: "2023-11-20T10:30:00Z", gas_fee_usd: 12 },
  { hash: "0xbbbb...", chain: "Ethereum", type: "swap", from_token: "ETH", to_token: "UNI", amount: "0.8", value_usd: 1600, timestamp: "2023-09-05T14:20:00Z", gas_fee_usd: 10 },
  { hash: "0xcccc...", chain: "Polygon", type: "transfer", token: "MATIC", to_address: "0xdefg...", amount: "1000", value_usd: 800, timestamp: "2023-07-12T08:25:00Z", gas_fee_usd: 0.3 },
  
  // 2022 transactions
  { hash: "0xdddd...", chain: "Ethereum", type: "swap", from_token: "ETH", to_token: "SHIB", amount: "0.3", value_usd: 900, timestamp: "2022-12-10T10:30:00Z", gas_fee_usd: 25 },
  { hash: "0xeeee...", chain: "Ethereum", type: "swap", from_token: "SHIB", to_token: "ETH", amount: "150000000", value_usd: 1800, timestamp: "2022-05-15T14:20:00Z", gas_fee_usd: 30 },
  
  // 2021 transactions
  { hash: "0xffff...", chain: "Ethereum", type: "swap", from_token: "ETH", to_token: "DOGE", amount: "1.2", value_usd: 3000, timestamp: "2021-05-01T08:25:00Z", gas_fee_usd: 18 },
  { hash: "0x0000...", chain: "Ethereum", type: "swap", from_token: "DOGE", to_token: "ETH", amount: "12000", value_usd: 7200, timestamp: "2021-09-12T10:30:00Z", gas_fee_usd: 22 },
];

// Gas analysis mock data
export const mockGasAnalysis: GasAnalysis = {
  total_gas_spent_usd: 85,
  transaction_count: 12,
  average_gas_per_tx_usd: 7.08,
  highest_gas_tx: { hash: "0x4567...", gas_fee_usd: 20, timestamp: "2024-03-05T16:45:00Z", type: "swap" },
  gas_by_type: {
    swap: { count: 5, total_usd: 45, average_usd: 9 },
    transfer: { count: 3, total_usd: 20, average_usd: 6.67 },
    approve: { count: 4, total_usd: 20, average_usd: 5 },
  },
  optimization_tips: [
    "Consider using L2 solutions like Arbitrum or Optimism for smaller transactions to reduce gas fees by up to 90%",
    "Batch multiple transfers together when possible to save on gas costs",
    "For token approvals, use specific amounts instead of unlimited approvals for better security",
    "Try to execute transactions during off-peak hours when gas prices are lower",
  ],
  current_gas_prices: {
    slow: { gwei: 20, estimated_time: "10 minutes", usd_for_transfer: 3 },
    average: { gwei: 30, estimated_time: "3 minutes", usd_for_transfer: 4.5 },
    fast: { gwei: 45, estimated_time: "1 minute", usd_for_transfer: 6.75 },
  },
};

// Portfolio analysis mock data
export const mockPortfolioAnalysis: PortfolioAnalysis = {
  diversification: {
    by_asset_type: {
      "Large Cap": { percentage: 73.5, value_usd: 4350 },  // ETH
      "Mid Cap": { percentage: 10.1, value_usd: 600 },     // LINK
      "Small Cap": { percentage: 16.4, value_usd: 970 },   // MATIC, UNI, FIL
    },
    by_chain: {
      "Ethereum": { percentage: 86.1, value_usd: 5100 },   // ETH, LINK, UNI
      "Polygon": { percentage: 12.2, value_usd: 720 },     // MATIC
      "Filecoin": { percentage: 1.7, value_usd: 100 },     // FIL
    },
    by_token: [
      { token: "ETH", percentage: 73.5, value_usd: 4350 },
      { token: "MATIC", percentage: 12.2, value_usd: 720 },
      { token: "LINK", percentage: 10.1, value_usd: 600 },
      { token: "UNI", percentage: 2.5, value_usd: 150 },
      { token: "FIL", percentage: 1.7, value_usd: 100 },
    ],
    risk_assessment: "High", // High, Medium, Low
    concentration_risk: "High - 73.5% in ETH",
  },
  performance: {
    overall: {
      change_30d_pct: 8.2,
      change_30d_usd: 450,
    },
    by_token: [
      { token: "ETH", change_30d_pct: 5.3, change_30d_usd: 220 },
      { token: "MATIC", change_30d_pct: 15.1, change_30d_usd: 95 },
      { token: "LINK", change_30d_pct: 20.2, change_30d_usd: 100 },
      { token: "UNI", change_30d_pct: -2.1, change_30d_usd: -3.2 },
      { token: "FIL", change_30d_pct: 40.8, change_30d_usd: 29 },
    ],
    best_performer: { token: "FIL", change_30d_pct: 40.8 },
    worst_performer: { token: "UNI", change_30d_pct: -2.1 },
  },
  suggestions: [
    "Your portfolio is heavily concentrated in ETH (73.5%). Consider diversifying to reduce risk.",
    "Adding some stablecoins would reduce overall portfolio volatility.",
    "Consider exploring DeFi opportunities to generate yield on your assets.",
    "Your portfolio lacks exposure to Bitcoin, which may provide additional diversification.",
  ],
};

// Identity resolution mock data
export const mockIdentities: IdentityInfo[] = [
  { type: 'ENS', identifier: 'vitalik.eth', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
  { type: 'ENS', identifier: 'uniswap.eth', address: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC' },
  { type: 'Lens', identifier: 'lens/stani', address: '0x7E0b0363404751346930AF9bA7a5Aad8a2dE06d3' },
  { type: 'Farcaster', identifier: 'fc/dwr.eth', address: '0x6b0bda3f2ffed5efc83fa8c024acad2d31870ac9' },
];

// TVL Data mock
export const mockTVLData = {
  protocols: [
    { name: "Lido", current_tvl_usd: 21500000000, month_ago_tvl_usd: 19800000000, change_pct: 8.59 },
    { name: "MakerDAO", current_tvl_usd: 7300000000, month_ago_tvl_usd: 7100000000, change_pct: 2.82 },
    { name: "Aave", current_tvl_usd: 5100000000, month_ago_tvl_usd: 4800000000, change_pct: 6.25 },
    { name: "Curve", current_tvl_usd: 3700000000, month_ago_tvl_usd: 3400000000, change_pct: 8.82 },
    { name: "Compound", current_tvl_usd: 2900000000, month_ago_tvl_usd: 2700000000, change_pct: 7.41 },
    { name: "Uniswap", current_tvl_usd: 3100000000, month_ago_tvl_usd: 2900000000, change_pct: 6.90 },
    { name: "Convex", current_tvl_usd: 3500000000, month_ago_tvl_usd: 3000000000, change_pct: 16.67 },
    { name: "Balancer", current_tvl_usd: 1500000000, month_ago_tvl_usd: 1600000000, change_pct: -6.25 },
    { name: "dYdX", current_tvl_usd: 420000000, month_ago_tvl_usd: 380000000, change_pct: 10.53 },
    { name: "Yearn", current_tvl_usd: 380000000, month_ago_tvl_usd: 410000000, change_pct: -7.32 },
  ],
  defi_total_tvl_usd: 49400000000,
  defi_month_ago_total_tvl_usd: 46090000000,
  defi_change_pct: 7.18,
}; 