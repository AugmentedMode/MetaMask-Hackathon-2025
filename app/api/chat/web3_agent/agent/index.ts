import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { tools } from "../tools";
import { AGENT_CONFIG, DEBUG_MODE } from "../config";

/**
 * Factory function to create a Web3 agent
 * @param walletAddress Optional connected wallet address to use in interactions
 * @returns A configured ReAct agent for Web3 interactions
 */
export const createWeb3Agent = (walletAddress?: string) => {
  // Initialize the chat model with the configured settings
  const chat = new ChatOpenAI({
    model: AGENT_CONFIG.llm.model,
    temperature: AGENT_CONFIG.llm.temperature,
  });

  if (DEBUG_MODE) {
    console.log(`Creating Web3 agent with model: ${AGENT_CONFIG.llm.model}`);
    console.log(`Available tools: ${tools.map(tool => tool.name).join(", ")}`);
    console.log(`User wallet address: ${walletAddress || 'Not connected'}`);
  }

  // Create a system message with the wallet address if available
  let systemPrompt = AGENT_CONFIG.systemPrompt;
  
  if (walletAddress) {
    systemPrompt += `\n\nThe user's connected wallet address is: ${walletAddress}. You can use this address with your tools when appropriate.`;
  }

  // Create a ReAct agent with our tools and system prompt
  const agent = createReactAgent({
    llm: chat,
    tools,
    messageModifier: new SystemMessage(systemPrompt),
  });

  return agent;
};

export default createWeb3Agent; 