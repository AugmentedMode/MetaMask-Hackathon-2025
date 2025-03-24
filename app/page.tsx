"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { SuggestionButtons } from "@/components/SuggestionButtons";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Web3AgentPage() {
  const [input, setInput] = useState("");
  
  // Example suggestions for the web3 agent
  const suggestions = [
    "What is my address and what tokens do I have in my portfolio?",
    "What is my portfolio in eth and usd?",
    "How much gas did i spend in the last 2 years?",
    "I want to swap 100 shib for usdc in uniswap",
    "Explain how liquidity pools work",
    "I want to bridge 200 eth from mainnet to arbtrium",
    "How can I get the best returns for my tokens?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const InfoCard = (
    <GuideInfoBox>
      <div className="flex flex-col items-center text-center py-4 text-primary">
        <h1 className="text-4xl font-bold mb-4">What can I help with onchain?</h1>
        <p className="text-xl mb-6">Ask anything about your assets, activity, or web3 opportunities</p>
      </div>
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