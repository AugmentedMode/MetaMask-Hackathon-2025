# MetaMask Web3 Agent

## Overview

The MetaMask Web3 Agent is an AI-powered assistant built on LangChain ReAct framework that helps users with Web3 tasks including portfolio analysis, yield opportunities, price tracking, and transaction history analysis.

## Core Features

- Portfolio analysis and token balance tracking
- Real-time token prices and market data
- Yield farming and staking opportunity discovery
- Transaction history and gas usage optimization
- DeFi protocol TVL analysis

## Architecture

```
├── app/web3-agent/            # Frontend UI components
└── app/api/chat/web3_agent/   # Backend API
    ├── agent/                 # Agent configuration
    ├── tools/                 # Web3 tools
    ├── data/                  # Data providers
    └── utils/                 # Utility functions
```

## Available Tools

| Tool | Description |
|------|-------------|
| `get_portfolio_balances` | User's token balances |
| `get_token_price` | Current price and 24h change |
| `get_defi_yields` | Yield farming opportunities |
| `get_transaction_history` | User's transaction history |
| `analyze_gas_usage` | Gas optimization |
| `analyze_portfolio` | Portfolio analysis |
| `resolve_identity` | ENS, Lens, Farcaster resolution |
| `analyze_protocol_tvl` | DeFi protocol TVL analysis |
| `calculator` | Mathematical calculations |

## Quick Start

### Configuration

```typescript
// Toggle mock data mode in config/index.ts
USE_MOCK_DATA: true | false
```

### Adding a New Tool

1. Define the tool in `tools/index.ts`
2. Add data service function in `data/dataService.ts`
3. Add formatter in `utils/messageUtils.ts`

### Customization

- UI: Modify components in `app/web3-agent/page.tsx`
- Agent behavior: Update `agent/index.ts` and `config/index.ts`
- Response formats: Customize `utils/messageUtils.ts`

## Best Practices

- Keep tools focused on a single responsibility
- Use structured schemas to validate inputs
- Implement caching for frequently used data
- Format responses with markdown for readability
- Provide graceful fallbacks for missing data 