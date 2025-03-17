import { Message as VercelChatMessage, ToolCall as VercelToolCall } from "ai";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ToolCall as LangChainToolCall } from "@langchain/core/messages/tool";

/**
 * Safely converts message content to string
 */
const ensureString = (content: any): string => {
  if (typeof content === "string") {
    return content;
  }
  // Handle complex message content
  return JSON.stringify(content);
};

// Utility function to convert Vercel AI SDK message format to LangChain message format
export const convertVercelMessageToLangChainMessage = (message: VercelChatMessage): BaseMessage => {
  const content = ensureString(message.content);
  
  if (message.role === "user") {
    return new HumanMessage(content);
  } else if (message.role === "assistant") {
    return new AIMessage(content);
  } else if (message.role === "system") {
    return new SystemMessage(content);
  } else if (message.role === "tool") {
    return new ToolMessage({
      content,
      tool_call_id: (message as any).tool_call_id,
      name: (message as any).name,
    });
  } else {
    return new ChatMessage(content, message.role);
  }
};

// Type for our internal Vercel message representation
// We're only using this for converting from LangChain, so we omit the ID
// The Vercel AI SDK will handle adding IDs when needed
type InternalVercelMessage = Omit<VercelChatMessage, 'id'>;

/**
 * Converts LangChain tool calls to Vercel tool calls format
 * This is needed due to differences in the tool call schemas
 */
const convertToolCalls = (
  langChainToolCalls: LangChainToolCall[]
): VercelToolCall[] => {
  return langChainToolCalls.map((toolCall) => ({
    // Generate a fallback ID if not available
    id: toolCall.id || `tool_call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'function',
    function: {
      name: toolCall.name,
      arguments: JSON.stringify(toolCall.args),
    },
  }));
};

// Utility function to convert LangChain message format to Vercel AI SDK message format
export const convertLangChainMessageToVercelMessage = (message: BaseMessage): InternalVercelMessage => {
  const content = ensureString(message.content);
  const messageType = message._getType();
  
  if (messageType === "human") {
    return { content, role: "user" };
  } else if (messageType === "ai") {
    // We need to omit tool_calls if they don't exist to avoid type errors
    const aiMessage = message as AIMessage;
    
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      return {
        content,
        role: "assistant",
        tool_calls: convertToolCalls(aiMessage.tool_calls),
      };
    }
    
    return { content, role: "assistant" };
  } else if (messageType === "system") {
    return { content, role: "system" };
  } else if (messageType === "tool") {
    const toolMessage = message as ToolMessage;
    return {
      content,
      role: "tool",
      // @ts-ignore - Adding properties that Vercel doesn't have but might be useful
      tool_call_id: toolMessage.tool_call_id,
      name: toolMessage.name,
    };
  } else {
    // Map custom message types to system messages for compatibility
    return { content, role: "system" };
  }
};

// Format a tool call for display as a system message
export const formatToolCallForDisplay = (toolCall: any): ChatMessage => {
  const toolName = toolCall.name;
  const args = toolCall.args || {};
  
  // Create a human-readable description of the tool action
  let description = "Working on your request... ";
  
  switch (toolName) {
    case 'get_defi_yields':
      description += `Searching for the best yield opportunities for ${args.token}...`;
      break;
    case 'get_token_price':
      description += `Checking the current price of ${args.token}${args.chain ? ` on ${args.chain}` : ''}...`;
      break;
    case 'get_portfolio_balances':
      description += `Analyzing your portfolio composition...`;
      break;
    case 'get_transaction_history':
      description += `Retrieving your recent transaction history${args.chain ? ` on ${args.chain}` : ''}...`;
      break;
    case 'analyze_gas_usage':
      description += `Analyzing your gas usage patterns and looking for optimization opportunities...`;
      break;
    case 'analyze_portfolio':
      description += `Performing a detailed analysis of your portfolio performance and diversification...`;
      break;
    case 'search_historical_transactions':
      description += `Searching for specific transactions in your history...`;
      break;
    case 'resolve_identity':
      description += `Resolving the identity for ${args.identifier}...`;
      break;
    case 'analyze_protocol_tvl':
      description += `Analyzing DeFi protocol TVL changes over the past month...`;
      break;
    default:
      description += `Using ${toolName} to find information...`;
  }
  
  return new ChatMessage(
    description,
    "system"
  );
};

// Helper to convert JSON data to human-readable text based on tool name
const convertJsonToHumanText = (toolName: string, jsonData: string): string => {
  try {
    const data = JSON.parse(jsonData);
    
    switch (toolName) {
      case 'get_defi_yields': 
        return formatDefiYieldsResponse(data);
      case 'get_token_price':
        return formatTokenPriceResponse(data);
      case 'get_portfolio_balances':
        return formatPortfolioResponse(data);
      case 'get_transaction_history':
        return formatTransactionHistoryResponse(data);
      case 'analyze_gas_usage':
        return formatGasAnalysisResponse(data);
      case 'analyze_portfolio':
        return formatPortfolioAnalysisResponse(data);
      case 'search_historical_transactions':
        return formatHistoricalTransactionsResponse(data);
      case 'resolve_identity':
        return formatIdentityResponse(data);
      case 'analyze_protocol_tvl':
        return formatProtocolTVLResponse(data);
      default:
        // If we don't have a specific formatter, return a better formatted version of the JSON
        return `Here's what I found:\n\n${JSON.stringify(data, null, 2)}`;
    }
  } catch (e) {
    // If we can't parse the JSON, return the original content
    return jsonData;
  }
};

// Format DeFi yields data
const formatDefiYieldsResponse = (data: any[]): string => {
  if (!data || data.length === 0) {
    return "I couldn't find any yield opportunities for this token.";
  }
  
  let response = "Here are the best yield opportunities I found:\n\n";
  
  data.forEach((item, index) => {
    response += `${index + 1}. **${item.protocol}**: ${item.apy}% APY (${item.type})\n`;
  });
  
  response += "\nThese rates may change frequently based on market conditions. Always do your own research before depositing funds.";
  
  return response;
};

// Format token price data
const formatTokenPriceResponse = (data: any): string => {
  if (!data || !data.price) {
    return "I couldn't find price information for this token.";
  }
  
  const priceFormatted = data.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: data.price < 1 ? 4 : 2
  });
  
  const changeDirection = data.change_24h >= 0 ? 'up' : 'down';
  const changeSymbol = data.change_24h >= 0 ? '📈' : '📉';
  
  return `The current price is ${priceFormatted} per token, which is ${changeDirection} ${Math.abs(data.change_24h).toFixed(2)}% in the last 24 hours ${changeSymbol}.`;
};

// Format portfolio data
const formatPortfolioResponse = (data: any): string => {
  if (!data || !data.balances || data.balances.length === 0) {
    return "I couldn't find any tokens in your portfolio.";
  }
  
  const totalValueFormatted = data.total_value_usd.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  let response = `Your portfolio is currently worth **${totalValueFormatted}** and includes:\n\n`;
  
  data.balances.forEach((balance: any) => {
    const valueFormatted = balance.value_usd.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    
    response += `- **${balance.amount} ${balance.token}** worth ${valueFormatted} on ${balance.chain}\n`;
  });
  
  return response;
};

// Format transaction history
const formatTransactionHistoryResponse = (data: any[]): string => {
  if (!data || data.length === 0) {
    return "I couldn't find any transaction history.";
  }
  
  let response = "Here are your recent transactions:\n\n";
  
  data.forEach((tx: any, index: number) => {
    const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    let txDetails = '';
    if (tx.type === 'swap') {
      txDetails = `Swapped ${tx.amount} ${tx.from_token} to ${tx.to_token}`;
    } else if (tx.type === 'transfer') {
      txDetails = `Transferred ${tx.amount} ${tx.token}`;
    } else if (tx.type === 'approve') {
      txDetails = `Approved ${tx.token} for ${tx.spender}`;
    } else if (tx.type === 'receive') {
      txDetails = `Received ${tx.amount} ${tx.token}`;
    } else {
      txDetails = `${tx.type} transaction of ${tx.token || ''}`;
    }
    
    response += `${index + 1}. **${date}**: ${txDetails} (Gas: $${tx.gas_fee_usd})\n`;
  });
  
  return response;
};

// Format gas analysis
const formatGasAnalysisResponse = (data: any): string => {
  if (!data) {
    return "I couldn't retrieve gas usage information.";
  }
  
  let response = `You've spent a total of $${data.total_gas_spent_usd.toFixed(2)} on gas fees across ${data.transaction_count} transactions, averaging $${data.average_gas_per_tx_usd.toFixed(2)} per transaction.\n\n`;
  
  response += "**Optimization tips:**\n";
  data.optimization_tips.forEach((tip: string, index: number) => {
    response += `${index + 1}. ${tip}\n`;
  });
  
  response += "\n**Current gas prices:**\n";
  response += `- Slow (${data.current_gas_prices.slow.estimated_time}): ${data.current_gas_prices.slow.gwei} Gwei ($${data.current_gas_prices.slow.usd_for_transfer} for a transfer)\n`;
  response += `- Average (${data.current_gas_prices.average.estimated_time}): ${data.current_gas_prices.average.gwei} Gwei ($${data.current_gas_prices.average.usd_for_transfer} for a transfer)\n`;
  response += `- Fast (${data.current_gas_prices.fast.estimated_time}): ${data.current_gas_prices.fast.gwei} Gwei ($${data.current_gas_prices.fast.usd_for_transfer} for a transfer)\n`;
  
  return response;
};

// Format other response types as needed
const formatPortfolioAnalysisResponse = (data: any): string => {
  if (!data) {
    return "I couldn't analyze your portfolio.";
  }
  
  let response = "**Portfolio Analysis**\n\n";
  
  // Performance section
  response += "**Performance:**\n";
  response += `Overall 30-day change: ${data.performance.overall.change_30d_pct > 0 ? '+' : ''}${data.performance.overall.change_30d_pct.toFixed(2)}% ($${data.performance.overall.change_30d_usd.toFixed(2)})\n`;
  response += `Best performer: ${data.performance.best_performer.token} (${data.performance.best_performer.change_30d_pct > 0 ? '+' : ''}${data.performance.best_performer.change_30d_pct.toFixed(2)}%)\n`;
  response += `Worst performer: ${data.performance.worst_performer.token} (${data.performance.worst_performer.change_30d_pct > 0 ? '+' : ''}${data.performance.worst_performer.change_30d_pct.toFixed(2)}%)\n\n`;
  
  // Diversification section
  response += "**Diversification:**\n";
  response += `Risk assessment: ${data.diversification.risk_assessment}\n`;
  response += `${data.diversification.concentration_risk}\n\n`;
  
  // Suggestions
  response += "**Suggestions:**\n";
  data.suggestions.forEach((suggestion: string, index: number) => {
    response += `${index + 1}. ${suggestion}\n`;
  });
  
  return response;
};

const formatHistoricalTransactionsResponse = (data: any[]): string => {
  if (!data || data.length === 0) {
    return "I couldn't find any transactions matching your search criteria.";
  }
  
  let response = `Found ${data.length} transactions matching your search criteria:\n\n`;
  
  data.slice(0, 5).forEach((tx: any, index: number) => {
    const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    let txDetails = '';
    if (tx.type === 'swap') {
      txDetails = `Swapped ${tx.amount} ${tx.from_token} to ${tx.to_token}`;
    } else if (tx.type === 'transfer') {
      txDetails = `Transferred ${tx.amount} ${tx.token}`;
    } else {
      txDetails = `${tx.type} transaction`;
    }
    
    response += `${index + 1}. **${date}** (${tx.chain}): ${txDetails} - Gas: $${tx.gas_fee_usd}\n`;
  });
  
  if (data.length > 5) {
    response += `\n...and ${data.length - 5} more transactions.`;
  }
  
  return response;
};

const formatIdentityResponse = (data: any): string => {
  if (!data || data.error) {
    return "I couldn't resolve this identity.";
  }
  
  return `The ${data.type} identity **${data.identifier}** resolves to address ${data.address}`;
};

const formatProtocolTVLResponse = (data: any): string => {
  if (!data || !data.protocols || data.protocols.length === 0) {
    return "I couldn't retrieve protocol TVL data.";
  }
  
  const totalTVLFormatted = (data.defi_total_tvl_usd / 1000000000).toFixed(2);
  const changePct = data.defi_change_pct.toFixed(2);
  
  let response = `The total DeFi TVL is currently **$${totalTVLFormatted} billion**, which is ${changePct}% ${data.defi_change_pct >= 0 ? 'up' : 'down'} from last month.\n\n`;
  
  response += "**Top protocols by TVL:**\n";
  
  data.protocols.slice(0, 5).forEach((protocol: any, index: number) => {
    const tvlFormatted = (protocol.current_tvl_usd / 1000000000).toFixed(2);
    response += `${index + 1}. **${protocol.name}**: $${tvlFormatted} billion (${protocol.change_pct >= 0 ? '+' : ''}${protocol.change_pct.toFixed(2)}% in 30 days)\n`;
  });
  
  return response;
};

// Format a tool response for display as a system message
export const formatToolResponseForDisplay = (toolMessage: ToolMessage): ChatMessage => {
  // Get the tool name from the message
  const toolName = toolMessage.name || '';
  
  // Convert the JSON content to human-readable text
  const content = convertJsonToHumanText(toolName, ensureString(toolMessage.content));
  
  return new ChatMessage(
    content,
    "system"
  );
}; 