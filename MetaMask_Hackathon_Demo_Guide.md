# MetaMask Web3 Agent - Hackathon Demo Guide

## Project Overview

The MetaMask Web3 Agent is an AI-powered assistant built to help users interact with Web3 services directly through conversational interfaces. It leverages the LangChain ReAct framework and integrates with MetaMask to provide a seamless experience for users to analyze their blockchain activities, discover opportunities, and make informed decisions.

## Key Features to Demonstrate

### 1. Wallet Integration

- **Connect MetaMask**: Show how users can connect their MetaMask wallet to the agent.
- **Address Recognition**: Demonstrate how the agent recognizes the connected address and can provide personalized information.

### 2. Portfolio Analysis

- **Token Balances**: Show a portfolio overview with current token balances.
- **Performance Tracking**: Display portfolio performance over time (daily, weekly, monthly).
- **Diversification Analysis**: Demonstrate how the agent can analyze portfolio diversification and risk.

### 3. Real-time Market Data

- **Token Prices**: Show current prices and 24-hour changes for various tokens.
- **Price Tracking**: Demonstrate how users can ask about specific token prices across different chains.

### 4. Transaction History and Analysis

- **Transaction List**: Display recent transactions with key details.
- **Gas Analysis**: Show the gas fee analysis tool that examines user's gas spending over time.
- **Transaction Search**: Demonstrate filtering transactions by token, type, or date range.

### 5. DeFi Opportunities

- **Yield Farming**: Show how the agent can find and recommend yield farming opportunities.
- **Staking Options**: Display staking options for different tokens.
- **Protocol TVL Analysis**: Demonstrate the protocol TVL analysis feature.

### 6. Token Swaps

- **Cross-Chain Swaps**: Demonstrate how the agent can create token swap suggestions.
- **Best Rate Comparison**: Show how it compares rates across different DEXs.
- **Gas-Optimized Routes**: Highlight the gas-efficient routing capabilities.

### 7. Layer 2 Bridging

- **ETH to L2 Bridging**: Show how the agent can help users bridge ETH to Layer 2 solutions (particularly Linea).
- **Fee Estimation**: Demonstrate the cost comparison between L1 and L2 transactions.
- **Bridge Status Checking**: Show how users can check the status of bridged assets.

### 8. Identity Resolution

- **ENS/Lens/Farcaster**: Show how the agent can resolve Web3 identities (e.g., vitalik.eth, lens profiles).

### 9. Interactive Assistance

- **Conversational Interface**: Demonstrate the natural language processing capabilities.
- **Multi-step Problem Solving**: Show how the agent can handle complex, multi-step queries.

## Demo Flow Suggestion

1. **Introduction** (1-2 minutes)
   - Explain the problem you're solving
   - Overview of the MetaMask Web3 Agent

2. **Wallet Connection** (1-2 minutes)
   - Connect MetaMask wallet
   - Show how the agent recognizes your address

3. **Portfolio Overview** (2-3 minutes)
   - Ask "What's in my wallet?"
   - Ask "How is my portfolio performing?"
   - Ask "How diversified is my portfolio?"

4. **Transaction Analysis** (2-3 minutes)
   - Ask "Show me my recent transactions"
   - Ask "How much have I spent on gas fees in the last month?"
   - Ask "Find all my ETH transactions in February"

5. **Market and DeFi Queries** (2-3 minutes)
   - Ask "What's the current price of ETH?"
   - Ask "What are the best yield opportunities for USDC?"
   - Ask "Which DeFi protocols have gained the most TVL recently?"

6. **Token Swaps & Bridging** (2-3 minutes)
   - Ask "I want to swap 0.1 ETH for USDC"
   - Ask "How can I bridge my ETH to Linea?"
   - Ask "Compare gas fees between Ethereum and Linea"

7. **Advanced Features** (2-3 minutes)
   - Demonstrate identity resolution: "Who is vitalik.eth?"
   - Show a complex query that requires multiple tool calls

8. **Conclusion** (1 minute)
   - Recap the key benefits
   - Share future development plans

## Technical Highlights to Mention

- **Architecture**: Built on Next.js with the LangChain framework and LangGraph
- **AI Framework**: ReAct agent pattern for reasoning and action
- **API Integration**: Connection to blockchain data providers for real-time information
- **Tool-based Design**: Modular tool system for extensibility
- **Response Formatting**: Structured, user-friendly responses with markdown support

## Demo Tips

- Have a test wallet with diverse transactions and tokens ready for the demo
- Prepare example questions for each feature in case of live demo issues
- Have backup screenshots if API connections are unstable
- Consider demonstrating with mock data first, then with real data if time permits
- Highlight the conversational capabilities by asking follow-up questions

## Troubleshooting During Demo

- **API Errors**: If you get "fetch failed" errors (as seen in logs), be ready to switch to mock data by setting `USE_MOCK_DATA: true` in your config
- **Portfolio Balance Issues**: Have screenshots of portfolio balances ready to show in case the live API fails
- **Slow Responses**: If the agent takes too long to respond, have preset responses ready to show
- **Network Issues**: Prepare to demonstrate on a stable network connection or have a hotspot backup
- **Model/AI Issues**: If the AI model has trouble with specific queries, have simpler alternative questions ready

## Potential Questions to Prepare For

- How does the agent access blockchain data?
- What measures are in place for user privacy and security?
- How does the agent handle network-specific tasks?
- What's the roadmap for future development?
- How does the performance compare to traditional portfolio trackers?
- Why did you choose to include bridging to Linea specifically?
- What kinds of swap providers does your token swap feature integrate with? 