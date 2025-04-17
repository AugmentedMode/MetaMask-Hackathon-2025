import React from 'react';
import PortfolioChart, { PortfolioData } from './PortfolioChart';
import GasUsageChart, { GasUsageData } from './GasUsageChart';
import TokenSwapCard, { TokenSwapData } from './TokenSwapCard';
import BridgeCard, { BridgeData } from './BridgeCard';

// Component to render tool results
const ToolResult = ({ content }: { content: string }) => {
  // Parse the tool name and output from the XML-like format
  const nameMatch = content.match(/<tool-name>(.*?)<\/tool-name>/s);
  const outputMatch = content.match(/<tool-output>(.*?)<\/tool-output>/s);
  
  const toolName = nameMatch ? nameMatch[1].trim() : '';
  const toolOutput = outputMatch ? outputMatch[1].trim() : '';
  
  // Special handling for portfolio balances
  if (toolName === 'get_portfolio_balances') {
    try {
      const portfolioData = JSON.parse(toolOutput) as PortfolioData;
      return (
        <div className="my-4">
          <PortfolioChart data={portfolioData} />
        </div>
      );
    } catch (e) {
      console.error('Failed to parse portfolio data:', e);
      // Fall back to default rendering if parsing fails
    }
  }
  
  // Special handling for gas usage analysis
  if (toolName === 'analyze_gas_usage') {
    try {
      const gasUsageData = JSON.parse(toolOutput) as GasUsageData;
      return (
        <div className="my-4">
          <div className="font-medium text-gray-700 mb-2">
            Gas Usage Analysis
          </div>
          <GasUsageChart data={gasUsageData} />
        </div>
      );
    } catch (e) {
      console.error('Failed to parse gas usage data:', e);
      // Fall back to default rendering if parsing fails
    }
  }
  
  // Special handling for token swap links
  if (toolName === 'create_token_swap') {
    try {
      const swapData = JSON.parse(toolOutput) as TokenSwapData;
      return <TokenSwapCard data={swapData} />;
    } catch (e) {
      console.error('Failed to parse token swap data:', e);
      // Fall back to default rendering if parsing fails
    }
  }
  
  // Special handling for L2 bridge operations
  if (toolName === 'bridge_eth_to_l2') {
    try {
      const bridgeData = JSON.parse(toolOutput) as BridgeData;
      return <BridgeCard data={bridgeData} />;
    } catch (e) {
      console.error('Failed to parse bridge data:', e);
      // Fall back to default rendering if parsing fails
    }
  }
  
  /*return (
    <div className="my-2 p-3 border border-gray-200 rounded-md bg-gray-50">
      <div className="font-medium text-gray-700 mb-1">
        Tool: {toolName}
      </div>
      <div className="text-sm text-gray-600 whitespace-pre-wrap">
        {toolOutput}
      </div>
    </div>
  );*/
  return null;
};

export default ToolResult; 