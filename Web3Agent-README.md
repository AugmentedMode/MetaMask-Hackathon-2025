# MetaMask Web3 Agent

## Overview

The MetaMask Web3 Agent is an AI-powered assistant that helps users with various Web3-related tasks, including:

- Analyzing token portfolios and performance
- Finding optimal yield farming and staking opportunities
- Retrieving token prices and market data
- Examining transaction history and gas usage
- Providing insights on DeFi protocols and TVL changes

The agent is built on the LangChain ReAct agent framework and uses a structured approach to process user queries, gather information using specialized Web3 tools, and return natural language responses.

## Architecture

The Web3 agent system consists of these main components:

```
├── app/web3-agent/            # Frontend UI component
└── app/api/chat/web3_agent/   # Backend API
    ├── agent/                 # Agent configuration
    ├── config/                # System settings
    ├── data/                  # Data providers (real and mock)
    ├── tools/                 # Tool definitions
    ├── types/                 # TypeScript interfaces
    ├── utils/                 # Utility functions
    └── route.ts               # API endpoint
```

### Key Components

1. **Web3 Agent UI (`app/web3-agent/page.tsx`)**
   - Provides a chat interface for user interactions
   - Displays clickable suggestion buttons for common queries
   - Shows intermediate steps with a collapsible interface

2. **API Route (`app/api/chat/web3_agent/route.ts`)**
   - Accepts user messages and processes them through the agent
   - Handles streaming responses and intermediate steps
   - Returns formatted responses to the frontend

3. **Agent Configuration (`agent/index.ts`)**
   - Initializes the ReAct agent with the LLM configuration
   - Sets up the system prompt and available tools

4. **Tools (`tools/index.ts`)**
   - Defines structured tools for various Web3 operations
   - Each tool is responsible for a specific capability (e.g., getting token prices)

5. **Data Services (`data/dataService.ts`)**
   - Handles data fetching from external sources or mock data
   - Includes caching mechanisms to improve performance

6. **Message Utilities (`utils/messageUtils.ts`)**
   - Formats responses into human-readable text
   - Handles conversion between different message formats

## Request/Response Flow

Here's how the Web3 agent processes user requests:

1. **User Query**: The user sends a message through the chat interface
2. **Frontend Handling**: The frontend passes the message to the backend API
3. **Agent Processing**:
   - The agent analyzes the user's query
   - It determines which tools are needed to fulfill the request
   - It calls the appropriate tools to gather information
4. **Tool Execution**:
   - Each tool fetches data from relevant sources
   - Data is formatted as structured JSON
5. **Response Generation**:
   - The agent combines tool outputs to create a comprehensive response
   - Message utilities format the JSON data into natural language
6. **Frontend Rendering**:
   - The chat interface displays the response with proper formatting
   - Intermediate steps show the agent's "thinking" process

## Available Tools

The Web3 agent has access to the following tools:

| Tool Name | Description | Example Usage |
|-----------|-------------|--------------|
| `get_portfolio_balances` | Gets user's token balances and total value | "What tokens do I own?" |
| `get_token_price` | Gets current price and 24h change for a token | "What's the price of ETH?" |
| `get_defi_yields` | Gets yield farming/staking opportunities | "Best yields for ETH?" |
| `get_transaction_history` | Gets user's transaction history | "Show my recent transactions" |
| `analyze_gas_usage` | Analyzes gas spending and provides tips | "How can I optimize gas?" |
| `analyze_portfolio` | Provides portfolio analysis and suggestions | "Analyze my portfolio" |
| `search_historical_transactions` | Searches for specific past transactions | "Find my USDC swaps" |
| `resolve_identity` | Resolves ENS, Lens, or Farcaster identifiers | "Resolve vitalik.eth" |
| `analyze_protocol_tvl` | Shows TVL changes in DeFi protocols | "Which protocols are growing?" |
| `calculator` | Performs mathematical calculations | "Calculate 0.5 ETH in USD" |

## Data Formatting

The system transforms raw JSON data into natural language responses. For example:

**Raw JSON:**
```json
[
  {"protocol":"Lido","apy":3.5,"type":"staking"},
  {"protocol":"Rocket Pool","apy":3.2,"type":"staking"},
  {"protocol":"Aave","apy":0.8,"type":"lending"}
]
```

**Formatted Response:**
```
Here are the best yield opportunities I found:

1. **Lido**: 3.5% APY (staking)
2. **Rocket Pool**: 3.2% APY (staking)
3. **Aave**: 0.8% APY (lending)

These rates may change frequently based on market conditions. Always do your own research before depositing funds.
```

This formatting happens in the `messageUtils.ts` file, which contains dedicated formatters for each type of data.

## Extending the Agent

### Adding a New Tool

To add a new tool to the Web3 agent:

1. Define the tool in `tools/index.ts`:

```typescript
export const newCustomTool = new DynamicStructuredTool({
  name: "new_custom_tool",
  description: "Description of what the tool does",
  schema: z.object({
    parameter1: z.string().describe("Description of parameter1"),
    parameter2: z.number().optional().describe("Description of parameter2"),
  }),
  func: async ({ parameter1, parameter2 }) => {
    const data = await dataService.getCustomData(parameter1, parameter2);
    return JSON.stringify(data);
  },
});

// Add the tool to the tools array
export const tools = [
  // ...existing tools,
  newCustomTool,
];
```

2. Add a data service function in `data/dataService.ts`:

```typescript
export const getCustomData = async (
  param1: string,
  param2?: number
): Promise<CustomDataType> => {
  // Implementation
};
```

3. Add a formatter in `utils/messageUtils.ts`:

```typescript
const formatCustomDataResponse = (data: any): string => {
  if (!data) {
    return "I couldn't find the requested information.";
  }
  
  let response = "Here's what I found:\n\n";
  // Format the data into natural language
  
  return response;
};

// Add to the switch statement in convertJsonToHumanText
case 'new_custom_tool':
  return formatCustomDataResponse(data);
```

### Modifying the System Prompt

To change the agent's personality or capabilities, modify the system prompt in `config/index.ts`:

```typescript
systemPrompt: `You are MetaMask Assistant, a helpful Web3 agent that...`
```

## Using the Real API Data

Currently, the system can work with either mock data (for development) or real API data:

1. **Mock Data Mode**: Set `USE_MOCK_DATA` to `true` in `config/index.ts`

2. **Real API Mode**: 
   - Set `USE_MOCK_DATA` to `false`
   - Configure the API endpoints in the `endpoints` section of `AGENT_CONFIG`
   - Make sure the external APIs return data in the expected format

## Display Components

The frontend uses several components to create a rich user experience:

1. **ChatWindow**: The main container for the chat interface
2. **SuggestionButtons**: Clickable buttons for common queries
3. **IntermediateStep**: Displays the agent's thinking steps with collapsible UI
4. **ChatMessageBubble**: Renders individual chat messages

## Best Practices

When working with the Web3 agent API:

1. **Tool Development**:
   - Keep tools focused on a single responsibility
   - Use structured schemas to validate inputs
   - Add clear descriptions to help the agent choose the right tool

2. **Response Formatting**:
   - Format numbers with proper currency symbols and decimals
   - Use markdown formatting for readability (bold, lists, etc.)
   - Include context and explanations, not just raw data

3. **Error Handling**:
   - Always provide graceful fallbacks for missing data
   - Include informative error messages
   - Use mock data for testing and development

4. **Performance**:
   - Implement caching for frequently used data
   - Limit the amount of data returned to what's necessary
   - Consider batching requests when possible

## Customization

You can customize the Web3 agent in several ways:

1. **UI Customization**: Modify the components in `app/web3-agent/page.tsx`
2. **Agent Configuration**: Update settings in `agent/index.ts` and `config/index.ts`
3. **Tool Set**: Add, remove, or modify tools in `tools/index.ts`
4. **Response Formatting**: Customize the formatters in `utils/messageUtils.ts`

## Conclusion

The MetaMask Web3 Agent provides a powerful, extensible framework for building AI-powered assistants for Web3 applications. By understanding its architecture and components, you can customize and extend it to suit your specific needs.

For further questions or improvements, please refer to the codebase or contact the development team. 