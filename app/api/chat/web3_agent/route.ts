import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import {
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { createWeb3Agent } from "./agent";
import { DEBUG_MODE } from "./config";
import { 
  convertVercelMessageToLangChainMessage, 
  convertLangChainMessageToVercelMessage,
  formatToolCallForDisplay,
  formatToolResponseForDisplay,
} from "./utils/messageUtils";

export const runtime = "edge";

/**
 * This handler initializes and calls a tool-using ReAct agent for Web3 interactions.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;
    const walletAddress = body.walletAddress;
    
    if (DEBUG_MODE) {
      console.log(`Processing request with intermediate steps: ${returnIntermediateSteps}`);
      console.log(`User wallet address: ${walletAddress || 'Not connected'}`);
    }
    
    // Filter out system messages for display purposes
    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);

    // Create a ReAct agent for Web3 interactions with wallet address
    const agent = createWeb3Agent(walletAddress);

    if (!returnIntermediateSteps) {
      // Stream back all generated tokens
      const eventStream = await agent.streamEvents(
        { messages },
        { version: "v2" },
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              // Only stream content chunks, not tool calls
              if (!!data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      // For intermediate steps, use a different approach
      const result = await agent.invoke({ messages });
      
      // Extract tool calls and tool outputs to show as intermediate steps
      const intermediateStepMessages: BaseMessage[] = [];
      
      // Find all tool calls and tool outputs from the agent run
      for (const message of result.messages) {
        // Handle tool call messages
        if (message._getType() === "ai" && (message as AIMessage).tool_calls) {
          const toolCalls = (message as AIMessage).tool_calls || [];
          
          for (const toolCall of toolCalls) {
            // Add the tool call as a system message
            intermediateStepMessages.push(formatToolCallForDisplay(toolCall));
            
            // Find corresponding tool output if it exists
            const toolOutputMessage = result.messages.find(
              (m) => 
                m._getType() === "tool" && 
                m.name === toolCall.name && 
                // @ts-ignore - LangChain types don't expose tool_call_id on BaseMessage
                m.tool_call_id === toolCall.id
            );
            
            if (toolOutputMessage) {
              intermediateStepMessages.push(formatToolResponseForDisplay(toolOutputMessage as any));
            }
          }
        }
      }
      
      // Add intermediate steps to all messages
      const allMessagesWithIntermediateSteps = [
        ...result.messages.map(convertLangChainMessageToVercelMessage),
        ...intermediateStepMessages.map(convertLangChainMessageToVercelMessage),
      ];
      
      return NextResponse.json(
        {
          messages: allMessagesWithIntermediateSteps,
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    console.error("Error in Web3 agent:", e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
} 