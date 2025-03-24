import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as dataService from "../data/dataService";

// ETH Bridge tool
export const createEthBridgeTool = new DynamicStructuredTool({
  name: "bridge_eth_to_l2",
  description: "Generate a link and instructions to bridge ETH from Ethereum mainnet to an L2 chain and automatically open the bridge. Can also handle bridging ETH and swapping to another token on the destination chain.",
  schema: z.object({
    amount: z.string().optional().describe("Amount of ETH to bridge (optional)"),
    address: z.string().optional().describe("User's wallet address (optional)"),
    l2Chain: z.string().describe("Destination L2 chain (e.g., Linea, Arbitrum, Optimism, Base, zkSync, Polygon)"),
    targetToken: z.string().optional().describe("Token to swap to after bridging (e.g., USDC, DAI, WETH). If provided, will bridge and swap."),
  }),
  func: async ({ amount, address, l2Chain, targetToken }) => {
    try {
      // If targetToken is provided, we'll do a bridge + swap operation
      if (targetToken) {
        const result = await dataService.getBridgeAndSwapLink({
          amount,
          address,
          l2Chain,
          targetToken,
        });
        
        return JSON.stringify({
          url: result.url,
          estimatedGas: result.estimatedGas,
          estimatedTime: result.estimatedTime,
          message: `I've automatically opened a bridge to transfer ${amount || "ETH"} from Ethereum mainnet to ${l2Chain} and swap it to ${targetToken}. The bridge should open in a new browser tab.`,
          autoOpen: true // Signal to frontend to automatically open this URL
        });
      } else {
        // Otherwise just do a regular bridge
        const result = await dataService.getBridgeLink({
          amount,
          address,
          l2Chain,
        });
        
        return JSON.stringify({
          url: result.url,
          estimatedGas: result.estimatedGas,
          estimatedTime: result.estimatedTime,
          message: `I've automatically opened a bridge to transfer ${amount || "ETH"} from Ethereum mainnet to ${l2Chain}. The bridge should open in a new browser tab.`,
          autoOpen: true // Signal to frontend to automatically open this URL
        });
      }
    } catch (error) {
      console.error("Error creating bridge link:", error);
      return JSON.stringify({
        error: "Failed to create bridge link",
        message: "There was an error generating the bridge link. Please try again later."
      });
    }
  },
}); 