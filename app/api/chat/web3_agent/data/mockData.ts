import {
  PortfolioData,
  TokenPrice,
  YieldOpportunity,
  Transaction,
  GasAnalysis,
  PortfolioAnalysis,
  IdentityInfo,
  AccountsAPIBalances,
  MarketData,
  AccountsAPITransactions,
  PricesAPIMarketData,
} from "../types";

// Mock data for development and testing

// Portfolio balances mock data
export const mockPortfolioData: AccountsAPIBalances = {
  balances: [
    {
      address: "0x0000000000000000000000000000000000000000",
      balance: "1.45",
      decimals: 18,
      chainId: 1,
      name: "Ethereum",
      symbol: "ETH",
      object: "native",
    },
    {
      address: "0xe868c3d83ec287c01bcb533a33d197d9bfa79dad",
      balance: "1200",
      decimals: 18,
      chainId: 137,
      object: "token",
      name: "Polygon",
      symbol: "MATIC",
    },
    {
      address: "0x514910771af9ca656af840dff83e8264ecf986ca",
      balance: "50",
      decimals: 18,
      chainId: 1,
      object: "token",
      name: "Chainlink",
      symbol: "LINK",
    },
    {
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      balance: "30",
      decimals: 18,
      chainId: 1,
      object: "token",
      name: "Uniswap",
      symbol: "UNI",
    },
    {
      address: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
      balance: "20",
      decimals: 6,
      chainId: 59144,
      object: "token",
      name: "USD Coin",
      symbol: "USDC",
    },
  ],
  count: 5,
  unprocessedNetworks: [],
};

// Token prices mock data
export const mockTokenPrices: PricesAPIMarketData = {
  "0x0000000000000000000000000000000000000000": {
    id: "Ether",
    price: 1979.73,
    priceChange1d: 0.1,
    marketCap: 238829010245,
    pricePercentChange1h: 0.05,
    pricePercentChange1d: 0.1,
    pricePercentChange7d: 0.2,
    pricePercentChange14d: 0.2,
    pricePercentChange30d: 0.5,
    pricePercentChange200d: 0.8,
    pricePercentChange1y: 1.2,
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    id: "USD Coin",
    price: 1.0,
    priceChange1d: -0.01,
    marketCap: 1000000000,
    pricePercentChange1h: 0.001,
    pricePercentChange1d: 0.0,
    pricePercentChange7d: 0.01,
    pricePercentChange14d: 0.0,
    pricePercentChange30d: 0.0,
    pricePercentChange200d: 0.0,
    pricePercentChange1y: 0.02,
  },
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
export const mockTransactions: AccountsAPITransactions = {
  unprocessedNetworks: [],
  pageInfo: {
    count: 50,
    hasNextPage: true,
    cursor:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIxIjp7Imhhc05leHRQYWdlIjp0cnVlLCJsYXN0VGltZXN0YW1wIjoiMjAyMy0wMy0yMlQyMjo0ODoyMy4wMDBaIn0sIjEwIjp7Imhhc05leHRQYWdlIjpmYWxzZSwibGFzdFRpbWVzdGFtcCI6IjIwMjUtMDItMThUMDI6MjE6NDUuMDAwWiJ9LCI1NiI6eyJoYXNOZXh0UGFnZSI6ZmFsc2UsImxhc3RUaW1lc3RhbXAiOiIyMDIwLTA5LTE3VDEyOjMwOjQ5LjAwMFoifSwiMTM3Ijp7Imhhc05leHRQYWdlIjp0cnVlLCJsYXN0VGltZXN0YW1wIjoiMjAyNC0wNi0xNVQyMzo1MToxNi4wMDBaIn0sIjg0NTMiOnsiaGFzTmV4dFBhZ2UiOmZhbHNlLCJsYXN0VGltZXN0YW1wIjoiMjAyNC0wNC0wOVQwMTowMjowNS4wMDBaIn0sIjQyMTYxIjp7Imhhc05leHRQYWdlIjpmYWxzZSwibGFzdFRpbWVzdGFtcCI6IjIwMjQtMDUtMDdUMDE6Mzg6NTYuMDAwWiJ9LCI1OTE0NCI6eyJoYXNOZXh0UGFnZSI6ZmFsc2UsImxhc3RUaW1lc3RhbXAiOiIyMDI0LTEwLTA3VDIyOjQ1OjM3LjAwMFoifSwiNTM0MzUyIjp7Imhhc05leHRQYWdlIjpmYWxzZSwibGFzdFRpbWVzdGFtcCI6IjIwMjQtMTAtMDRUMTc6MzQ6NDcuMDAwWiJ9LCJpYXQiOjE3NDI1MDM0OTZ9.h6mwHYTqFXB9fzClGoKXLXW9IAwxOvpr4KYFKvM-zO0",
  },
  data: [
    {
      hash: "0x047d946810d8bc29478a2321ba01dda489ea98491ef85d2187b793e9a65a648b",
      timestamp: "2025-03-19T00:23:28.000Z",
      chainId: 59144,
      accountId: "eip155:59144:0x5197b5b062288bbf29008c92b08010a92dd677cd",
      blockNumber: 17104848,
      blockHash:
        "0x9c03b6f54fb82169458a269ff8f6d86ed5748b6b1e37eeabce63776aace4c30b",
      gas: 2000000,
      gasUsed: 68445,
      gasPrice: "53370970",
      effectiveGasPrice: "53370970",
      nonce: 96011,
      cumulativeGasUsed: 68445,
      methodId: "0xf7ece0cf",
      value: "0",
      to: "0xa90b298d05c2667ddc64e2a4e17111357c215dd2",
      from: "0x9647c7b2f286b241769d17d7edc989149ab0636d",
      isError: false,
      valueTransfers: [
        {
          from: "0x5197b5b062288bbf29008c92b08010a92dd677cd",
          to: "0x4e7f8a0da914fa859e87d447b5366c5c1446a504",
          amount: "4596129",
          decimal: 6,
          contractAddress: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
          symbol: "USDC",
          name: "USDC",
          transferType: "erc20",
        },
      ],
      logs: [],
      toAddressName: "METAMASK_CARD_PAYMENT_PROVIDER",
      transactionProtocol: "METAMASK_CARD",
      transactionCategory: "PAYMENT",
      transactionType: "METAMASK_CARD_PAYMENT",
      readable: "MetaMask Card: Payment",
    },
    {
      hash: "0xfcd25ca29425352b259e8886aad9b0f302533e34d23a9a4da2510e316b167603",
      timestamp: "2025-03-18T23:34:45.000Z",
      chainId: 59144,
      accountId: "eip155:59144:0x5197b5b062288bbf29008c92b08010a92dd677cd",
      blockNumber: 17103775,
      blockHash:
        "0x93de67d90d250ee36c67ab8b29f189da968467f1e3f5eea3e612d451ec75c744",
      gas: 2000000,
      gasUsed: 68457,
      gasPrice: "53370970",
      effectiveGasPrice: "53370970",
      nonce: 95986,
      cumulativeGasUsed: 101725,
      methodId: "0xf7ece0cf",
      value: "0",
      to: "0xa90b298d05c2667ddc64e2a4e17111357c215dd2",
      from: "0x9647c7b2f286b241769d17d7edc989149ab0636d",
      isError: false,
      valueTransfers: [
        {
          from: "0x5197b5b062288bbf29008c92b08010a92dd677cd",
          to: "0x4e7f8a0da914fa859e87d447b5366c5c1446a504",
          amount: "20947761",
          decimal: 6,
          contractAddress: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
          symbol: "USDC",
          name: "USDC",
          transferType: "erc20",
        },
      ],
      logs: [],
      toAddressName: "METAMASK_CARD_PAYMENT_PROVIDER",
      transactionProtocol: "METAMASK_CARD",
      transactionCategory: "PAYMENT",
      transactionType: "METAMASK_CARD_PAYMENT",
      readable: "MetaMask Card: Payment",
    },
    {
      hash: "0x419bee5d0da0153b12a963ca0d33441cfcbca70417b0268987f48d656a8971ca",
      timestamp: "2025-03-18T09:36:40.000Z",
      chainId: 137,
      accountId: "eip155:137:0x5197b5b062288bbf29008c92b08010a92dd677cd",
      blockNumber: 69194652,
      blockHash:
        "0x1c38a65cbce6fd62ef531bcc9d38d6962b2d81247f2e10caddbb63e1994f44c5",
      gas: 1263205,
      gasUsed: 1263205,
      gasPrice: "26000000037",
      effectiveGasPrice: "26000000037",
      nonce: 8393,
      cumulativeGasUsed: 9952005,
      methodId: "0x729ad39e",
      value: "0",
      to: "0x86ec3e8c5055662267fd68a7299c878d27a7ca53",
      from: "0x8d90331924a1b18b2da11048b68b40b4a70e02be",
      isError: false,
      valueTransfers: [
        {
          from: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
          to: "0x5197b5b062288bbf29008c92b08010a92dd677cd",
          amount: "1",
          contractAddress: "0x86ec3e8c5055662267fd68a7299c878d27a7ca53",
          symbol: "250 $UЅDС - Redeem: t.ly/cpool",
          name: "$UЅDС REWARD:  t.ly/cpool",
          transferType: "erc20",
        },
      ],
      logs: [],
      transactionType: "GENERIC_CONTRACT_CALL",
      transactionCategory: "CONTRACT_CALL",
      readable: "Unknown contract interaction",
    },
    {
      hash: "0x48d1f926e703f46122f81c0cafd692dd7f7f5afae81be1a2d858e8807cba1837",
      timestamp: "2025-03-17T21:23:15.000Z",
      chainId: 59144,
      accountId: "eip155:59144:0x5197b5b062288bbf29008c92b08010a92dd677cd",
      blockNumber: 17063393,
      blockHash:
        "0x150541578a89e4903d0cd227beccddce191ab0fbf4c8effb842e4eaf4fd166aa",
      gas: 2000000,
      gasUsed: 68457,
      gasPrice: "59408402",
      effectiveGasPrice: "59408402",
      nonce: 94898,
      cumulativeGasUsed: 693620,
      methodId: "0xf7ece0cf",
      value: "0",
      to: "0xa90b298d05c2667ddc64e2a4e17111357c215dd2",
      from: "0x9647c7b2f286b241769d17d7edc989149ab0636d",
      isError: false,
      valueTransfers: [
        {
          from: "0x5197b5b062288bbf29008c92b08010a92dd677cd",
          to: "0x4e7f8a0da914fa859e87d447b5366c5c1446a504",
          amount: "47415238",
          decimal: 6,
          contractAddress: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
          symbol: "USDC",
          name: "USDC",
          transferType: "erc20",
        },
      ],
      logs: [],
      toAddressName: "METAMASK_CARD_PAYMENT_PROVIDER",
      transactionProtocol: "METAMASK_CARD",
      transactionCategory: "PAYMENT",
      transactionType: "METAMASK_CARD_PAYMENT",
      readable: "MetaMask Card: Payment",
    },
    {
      hash: "0x670133f14203c1b32a14d68f1f812b1da64267cab2e21e528f203b0bea624787",
      timestamp: "2025-03-17T19:08:08.000Z",
      chainId: 137,
      accountId: "eip155:137:0x5197b5b062288bbf29008c92b08010a92dd677cd",
      blockNumber: 69170519,
      blockHash:
        "0x66e60d1534e7aa7076bb98d2a98435232fdff95e98ce1c3b03b599b15412161c",
      gas: 1368945,
      gasUsed: 1368945,
      gasPrice: "25781295185",
      effectiveGasPrice: "25781295185",
      nonce: 7994,
      cumulativeGasUsed: 8884593,
      methodId: "0x729ad39e",
      value: "0",
      to: "0xfd6edfbbc01912705b87844b0b72ddec3336647c",
      from: "0x8d90331924a1b18b2da11048b68b40b4a70e02be",
      isError: false,
      valueTransfers: [
        {
          from: "0x532f27101965dd16442e59d40670faf5ebb142e4",
          to: "0x5197b5b062288bbf29008c92b08010a92dd677cd",
          tokenId: "0",
          contractAddress: "0xfd6edfbbc01912705b87844b0b72ddec3336647c",
          transferType: "erc721",
        },
      ],
      logs: [],
      transactionProtocol: "ERC_721",
      transactionCategory: "TRANSFER",
      transactionType: "ERC_721_TRANSFER",
      readable: "ERC 721: Transfer",
    },
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
  highest_gas_tx: { hash: "0x4567...", gas_fee_usd: 20, timestamp: "2024-03-05T16:45:00Z", type: "swap", chain: "Ethereum" },
  gas_by_type: {
    swap: { count: 5, total_usd: 45, average_usd: 9 },
    transfer: { count: 3, total_usd: 20, average_usd: 6.67 },
    approve: { count: 4, total_usd: 20, average_usd: 5 },
  },
  // optimization_tips: [
  //   "Consider using L2 solutions like Arbitrum or Optimism for smaller transactions to reduce gas fees by up to 90%",
  //   "Batch multiple transfers together when possible to save on gas costs",
  //   "For token approvals, use specific amounts instead of unlimited approvals for better security",
  //   "Try to execute transactions during off-peak hours when gas prices are lower",
  // ],
  // current_gas_prices: {
  //   slow: { gwei: 20, estimated_time: "10 minutes", usd_for_transfer: 3 },
  //   average: { gwei: 30, estimated_time: "3 minutes", usd_for_transfer: 4.5 },
  //   fast: { gwei: 45, estimated_time: "1 minute", usd_for_transfer: 6.75 },
  // },
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