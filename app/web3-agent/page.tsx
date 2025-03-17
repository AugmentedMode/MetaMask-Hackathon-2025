"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { SuggestionButtons } from "@/components/SuggestionButtons";
import { useState, useCallback } from "react";

export default function Web3AgentPage() {
  const [input, setInput] = useState("");
  
  // Example suggestions for the web3 agent
  const suggestions = [
    "What tokens do I have in my portfolio?",
    "What are the best yields for ETH?",
    "Show me the price of ETH in the last 24 hours",
    "Explain how liquidity pools work",
    "How do I bridge assets to Layer 2?",
    "What's the gas price right now?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          💰
          <span className="ml-2">
            This is the MetaMask Assistant chatbot, a helpful Web3 agent that specializes in cryptocurrency, DeFi, and blockchain information.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🤖
          <span className="ml-2">
            The Web3 agent can help with portfolio analysis, token prices, DeFi yields, transaction history, and more.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🔧
          <span className="ml-2">
            The agent is powered by LangChain's ReAct agent framework with custom Web3 tools.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>What tokens do I have in my portfolio?</code> or <code>What are the best yields for ETH?</code>
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  
  return (
    <ChatWindow
      endpoint="api/chat/web3_agent"
      emoji="💰"
      placeholder="I&apos;m a Web3 assistant! Ask me about crypto, DeFi, or your blockchain portfolio..."
      emptyStateComponent={InfoCard}
      showIntermediateStepsToggle={true}
      inputValue={input}
      onInputChange={setInput}
      suggestionButtons={
        <SuggestionButtons 
          suggestions={suggestions} 
          onSuggestionClick={handleSuggestionClick}
        />
      }
    />
  );
}