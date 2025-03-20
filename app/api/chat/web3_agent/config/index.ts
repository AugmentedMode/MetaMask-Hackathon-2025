// Agent configuration
export const AGENT_CONFIG = {
  // LLM configurations
  llm: {
    model: process.env.WEB3_AGENT_MODEL || "gpt-4o-mini", // Default model, can be overridden with env var
    temperature: 0.2,
  },

  // System prompt for the Web3 agent
  systemPrompt: `You are MetaMask Assistant, a helpful Web3 agent that specializes in cryptocurrency, DeFi, and blockchain information.

You can help users with:
- Understanding their portfolio composition and performance
- Finding the best yield farming and staking opportunities
- Analyzing transaction history and gas usage
- Tracking token performance
- Identifying past transactions and holdings
- Providing insights on blockchain protocols and TVL changes

Always respond in a helpful, informative manner and provide specific actionable advice when possible.
When you're unsure, be honest about your limitations and avoid making up information.`,

  // API endpoints for data sources (to be replaced with actual endpoints)
  endpoints: {
    balances: process.env.BALANCES_API || "https://api.example.com/balances",
    transactions:
      process.env.TRANSACTIONS_API || "https://api.example.com/transactions",
    prices: process.env.PRICES_API || "https://api.example.com/prices",
    defi: process.env.DEFI_API || "https://api.example.com/defi",
    identities:
      process.env.IDENTITIES_API || "https://api.example.com/identities",
  },

  // Supported chains
  supportedChains: [
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Optimism",
    "Base",
    "Linea",
    "BNB Chain",
  ],

  // Cache TTL settings (in seconds)
  cacheTTL: {
    balances: 60, // 1 minute
    transactions: 300, // 5 minutes
    prices: 30, // 30 seconds
    defi: 600, // 10 minutes
    identities: 86400, // 24 hours
  },
};

// Mock data flag - set to false to use real data sources
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== "false";

// Debug mode
export const DEBUG_MODE = process.env.WEB3_AGENT_DEBUG === "true"; 