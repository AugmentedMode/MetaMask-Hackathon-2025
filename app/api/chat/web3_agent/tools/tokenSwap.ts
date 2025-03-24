import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as dataService from "../data/dataService";

// Token swap tool
export const createTokenSwapTool = new DynamicStructuredTool({
  name: "create_token_swap",
  description: "Generate a link to swap tokens on MetaMask or Uniswap. Supports token symbols (e.g., ETH, USDC) which will be automatically converted to the appropriate token addresses.",
  schema: z.object({
    fromToken: z.string().describe("Token to swap from (e.g., ETH, MATIC)"),
    toToken: z.string().describe("Token to swap to (e.g., USDC, DAI)"),
    amount: z.string().optional().describe("Amount to swap (optional)"),
    platform: z.enum(["metamask", "uniswap"]).default("metamask").describe("Platform to use for swap (default: metamask)"),
    chain: z.string().optional().describe("Blockchain name (optional, default: Ethereum)"),
    address: z.string().optional().describe("User's wallet address (optional)"),
  }),
  func: async ({ fromToken, toToken, amount, platform, chain, address }) => {
    try {
      const result = await dataService.getSwapLink({
        fromToken,
        toToken,
        amount,
        platform,
        chain,
        address,
      });
      
      return JSON.stringify({
        url: result.url,
        message: `Here's a link to swap ${fromToken} to ${toToken} on ${result.platform}: ${result.url}`
      });
    } catch (error) {
      console.error("Error creating token swap link:", error);
      return JSON.stringify({
        error: "Failed to create swap link",
        message: "There was an error generating the swap link. Please try again later."
      });
    }
  },
});

export default createTokenSwapTool; 