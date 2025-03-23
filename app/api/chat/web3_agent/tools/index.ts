import { DynamicStructuredTool } from "@langchain/core/tools";
import { Calculator } from "@langchain/community/tools/calculator";
import { z } from "zod";
import * as dataService from "../data/dataService";

// Get portfolio balances tool
export const getPortfolioBalancesTool = new DynamicStructuredTool({
  name: "get_portfolio_balances",
  description: "Get the user's current token balances and portfolio value",
  schema: z.object({
    address: z
      .string()
      .optional()
      .describe("Ethereum address to check (optional)"),
  }),
  func: async ({ address }) => {
    if (!address) {
      return JSON.stringify({ error: "Address is required" });
    }
    const data = await dataService.getPortfolioBalances(address);

    return JSON.stringify(data);
  },
});

// Get token price tool
export const getTokenPriceTool = new DynamicStructuredTool({
  name: "get_token_price",
  description: "Get the current price and 24h change for a token",
  schema: z.object({
    token: z.string().describe("Token symbol (e.g., ETH, BTC)"),
    chain: z.string().optional().describe("Blockchain name (optional)"),
  }),
  func: async ({ token, chain }) => {
    const data = await dataService.getTokenPrice(token, chain);
    return JSON.stringify(data);
  },
});

// Get DeFi yields tool
export const getDefiYieldsTool = new DynamicStructuredTool({
  name: "get_defi_yields",
  description:
    "Get the best yield farming and staking opportunities for a token",
  schema: z.object({
    token: z.string().describe("Token symbol to find yield for"),
  }),
  func: async ({ token }) => {
    const data = await dataService.getDefiYields(token);
    return JSON.stringify(data);
  },
});

// Get transaction history tool
export const getTransactionHistoryTool = new DynamicStructuredTool({
  name: "get_transaction_history",
  description: "Get the user's transaction history on a specific chain",
  schema: z.object({
    address: z
      .string()
      .optional()
      .describe("Ethereum address to check (optional)"),
    chain: z
      .string()
      .optional()
      .describe("Blockchain name (e.g., Ethereum, Polygon, default: Ethereum)"),
    limit: z
      .number()
      .optional()
      .describe("Number of transactions to return (default: 5)"),
  }),
  func: async ({ address, chain = "Ethereum", limit = 5 }) => {
    const data = await dataService.getTransactionHistory(address, chain, limit);
    return JSON.stringify(data);
  },
});

// Gas usage analysis tool
export const analyzeGasUsageTool = new DynamicStructuredTool({
  name: "analyze_gas_usage",
  description: "Compute gas fees that the user has used to perform their transactions in a given period of time. Do not user the get_transaction_history tool for this, compute_gas_fees_used is self-sufficient. Display a detailed report, including the top gas fee transaction details.",
  schema: z.object({
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Public address").describe("Public address, starting with 0x"),
    period: z.number().describe("Time period to analyze, in seconds. Example: 86400 if the user specifies a period of 1 day."),
    chain: z.string().optional().describe("Network name (optional, default: Ethereum)"),
  }),
  func: async ({ address, chain = "Ethereum", period }) => {
    const data = await dataService.getGasAnalysis(address, chain, period);
    return JSON.stringify(data);
  },
});

// Portfolio analysis tool
export const analyzePortfolioTool = new DynamicStructuredTool({
  name: "analyze_portfolio",
  description: "Analyze portfolio diversification, risk, and performance",
  schema: z.object({
    address: z.string().optional().describe("Ethereum address to check (optional)"),
    period: z.string().optional().describe("Time period to analyze (e.g., 'week', 'month', 'year', default: 'month')"),
  }),
  func: async ({ address, period = "month" }) => {
    const data = await dataService.getPortfolioAnalysis(address, period);
    return JSON.stringify(data);
  },
});

// Historical transaction search tool
export const searchHistoricalTransactionsTool = new DynamicStructuredTool({
  name: "search_historical_transactions",
  description: "Search for specific historical transactions by token, type, or date range",
  schema: z.object({
    address: z.string().optional().describe("Ethereum address to check (optional)"),
    token: z.string().optional().describe("Token symbol to search for (e.g., ETH, MATIC)"),
    type: z.string().optional().describe("Transaction type (e.g., swap, transfer, approve)"),
    from_date: z.string().optional().describe("Start date in ISO format (e.g., 2021-01-01)"),
    to_date: z.string().optional().describe("End date in ISO format (e.g., 2024-03-16)"),
  }),
  func: async ({ address, token, type, from_date, to_date }) => {
    const data = await dataService.searchHistoricalTransactions({
      address,
      token,
      type,
      from_date,
      to_date,
    });
    return JSON.stringify(data);
  },
});

// Resolve identity tool (ENS, Lens, etc)
export const resolveIdentityTool = new DynamicStructuredTool({
  name: "resolve_identity",
  description: "Resolve ENS, Lens, or Farcaster identifier to Ethereum address",
  schema: z.object({
    identifier: z.string().describe("The identity to resolve (e.g., 'vitalik.eth', 'lens/stani', 'fc/dwr.eth')"),
  }),
  func: async ({ identifier }) => {
    const data = await dataService.resolveIdentity(identifier);
    return JSON.stringify(data || { error: "Identity not found" });
  },
});

// Protocol TVL analysis tool
export const analyzeProtocolTVLTool = new DynamicStructuredTool({
  name: "analyze_protocol_tvl",
  description: "Analyze protocols by TVL (Total Value Locked) change over the last month",
  schema: z.object({}),
  func: async () => {
    const data = await dataService.getProtocolsByTVLChange();
    return JSON.stringify(data);
  },
});

// Calculator tool from LangChain
export const calculatorTool = new Calculator();

// Export all tools in an array
export const tools = [
  calculatorTool,
  getPortfolioBalancesTool,
  getTokenPriceTool,
  getDefiYieldsTool,
  getTransactionHistoryTool,
  analyzeGasUsageTool,
  analyzePortfolioTool,
  searchHistoricalTransactionsTool,
  resolveIdentityTool,
  analyzeProtocolTVLTool,
]; 