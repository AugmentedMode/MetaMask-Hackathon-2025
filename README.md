# MetaMask Web3 Agent - Hackathon Project

## Project Overview

The MetaMask Web3 Agent is an AI-powered assistant built for the MetaMask Hackathon 2025. It helps users interact with Web3 services through a conversational interface, leveraging the LangChain ReAct framework and integrating with MetaMask to provide a seamless experience for analyzing blockchain activities, discovering opportunities, and making informed decisions.

## Key Features

### 🔗 Wallet Integration
- Connect your MetaMask wallet to receive personalized insights
- Automatic address recognition for a seamless experience

### 📊 Portfolio Analysis
- View token balances across multiple chains
- Track portfolio performance over time
- Analyze diversification and risk exposure

### 💱 Real-time Market Data
- Get current token prices and 24-hour changes
- Track specific tokens across different chains

### 📝 Transaction History and Analysis
- Access and filter your transaction history
- Analyze gas spending over time
- Search transactions by token, type, or date range

### 💰 DeFi Opportunities
- Discover yield farming and staking opportunities
- Compare rates across protocols
- Monitor protocol TVL (Total Value Locked) changes

### 🔄 Token Swaps
- Generate links for token swaps
- Compare rates across DEXs
- Find gas-optimized routes

### 🌉 Layer 2 Bridging
- Bridge ETH to L2 solutions (particularly Linea)
- Compare fees between L1 and L2 transactions
- Estimate bridging times and costs

### 🪪 Identity Resolution
- Resolve Web3 identities (ENS, Lens, Farcaster)
- Find wallet addresses associated with online identities

## Technical Stack

- **Frontend**: Next.js with a conversational UI
- **AI Framework**: LangChain + LangGraph for agentic workflows
- **Agent Pattern**: ReAct (Reasoning and Action) for complex problem solving
- **API Integration**: Connection to blockchain data providers for real-time information
- **Tool-based Design**: Modular system for extensibility

## Getting Started

1. Clone this repository
2. Copy `.env.example` to `.env.local` and add your API keys
3. Install dependencies: `npm install` or `yarn`
4. Run the development server: `npm run dev` or `yarn dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser
6. Connect your MetaMask wallet and start chatting with the agent!

## Try the Web3 Agent

The Web3 Agent is located at:
```
/app/api/chat/web3_agent
```

The agent uses various tools to interact with blockchain data, which you can find in:
```
/app/api/chat/web3_agent/tools
```

Data fetching and processing logic is located in:
```
/app/api/chat/web3_agent/data
```

## Example Queries

- "What's in my wallet?"
- "How much ETH do I have?"
- "What's the current price of LINK?"
- "Show me my recent transactions on Polygon"
- "How much have I spent on gas in the last month?"
- "What are the best yield opportunities for USDC?"
- "I want to swap 0.1 ETH for USDC"
- "How can I bridge my ETH to Linea?"
- "Who is vitalik.eth?"

## Future Development

- Integration with more chains and L2 solutions
- Enhanced portfolio analytics
- DeFi strategy recommendations
- Tax reporting assistance
- NFT portfolio management
- Cross-chain DEX aggregation
