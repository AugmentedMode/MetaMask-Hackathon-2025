"use client";

import { type Message } from "ai";
import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import type { FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import { useWallet } from './WalletContext';

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { IntermediateStep } from "@/components/IntermediateStep";
import { Button } from "@/components/ui/button";
import { ArrowDown, LoaderCircle, Paperclip } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";

function ChatMessages(props: {
  messages: Message[];
  emptyStateComponent: ReactNode;
  sourcesForMessages: Record<string, any>;
  aiEmoji?: string;
  className?: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.messages]);

  if (props.messages.length === 0 && props.emptyStateComponent) {
    return (
      <div className="grid min-h-screen place-items-center">
        {props.emptyStateComponent}
      </div>
    );
  }

  return (
    <div className={`overflow-auto` + (props.className ? ` ${props.className}` : "")}>
      <div className="flex flex-col max-w-[768px] mx-auto pb-12 w-full pt-8">
        {props.messages
          .filter((m) => m.role !== "system")
          .map((message) => {
            const sources = props.sourcesForMessages[message.id];
            return (
              <ChatMessageBubble
                key={message.id}
                message={message}
                aiEmoji={message.role === "assistant" ? props.aiEmoji : undefined}
                sources={sources}
              />
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export function ChatInput(props: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStop?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const disabled = props.loading && props.onStop == null;
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (props.loading) {
          props.onStop?.();
        } else {
          props.onSubmit(e);
        }
      }}
      className={cn("flex w-full flex-col", props.className)}
    >
      <div className="border border-input bg-white text-black rounded-lg flex flex-col gap-2 max-w-[768px] w-full mx-auto">
        <input
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          className="border-none outline-none bg-transparent p-4"
        />

        <div className="flex justify-between ml-4 mr-2 mb-2">
          <div className="flex gap-3">{props.children}</div>

          <div className="flex gap-2 self-end">
            {props.actions}
            <Button type="submit" className="self-end" disabled={disabled}>
              {props.loading ? (
                <span role="status" className="flex justify-center">
                  <LoaderCircle className="animate-spin" />
                  <span className="sr-only">Loading...</span>
                </span>
              ) : (
                <span className="font-bold">Send</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function ScrollToBottom(props: { 
  onClick: () => void;
  className?: string; 
}) {
  return (
    <Button
      onClick={props.onClick}
      variant="outline"
      size="default"
      className={`relative` + (props.className ? ` ${props.className}` : "")}
    >
      <span>Scroll to bottom</span>
    </Button>
  );
}

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  
  return (
    <div
      className={
        `min-h-screen bg-muted/40 flex flex-col relative` +
        (props.className ? ` ${props.className}` : "")
      }
    >
      <div
        ref={contentRef}
        className={
          `h-full overflow-auto` +
          (props.contentClassName ? ` ${props.contentClassName}` : "")
        }
      >
        {props.content}
      </div>
      <div className="sticky bottom-0 z-10 bg-background border-t">
        {props.footer}
      </div>
    </div>
  );
}

export function ChatLayout(props: { content: ReactNode; footer: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto" ref={contentRef}>
        {props.content}
      </div>
      <div className="sticky bottom-0 z-10 bg-background">
        {props.footer}
      </div>
    </div>
  );
}

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: ReactNode;
  placeholder?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
  suggestionButtons?: ReactNode;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}) {
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(
    props.showIntermediateStepsToggle ? false : true,
  );
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const { walletAddress, isConnected } = useWallet();

  const chat = useChat({
    api: props.endpoint,
    body: {
      show_intermediate_steps: showIntermediateSteps,
      walletAddress: isConnected ? walletAddress : null,
    },
    initialInput: props.inputValue,
    onResponse(response) {
      try {
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader
          ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
          : [];

        const messageIndexHeader = response.headers.get("x-message-index");
        if (sources.length && messageIndexHeader !== null) {
          setSourcesForMessages({
            ...sourcesForMessages,
            [messageIndexHeader]: sources,
          });
        }
      } catch (error) {
        // Handle parsing error or other issues
        console.error("Error processing response:", error);
      }
    },
    streamMode: "text",
    onError: (e) =>
      toast.error(`Error while processing your request`, {
        description: e.message,
      }),
  });

  // Sync input state with parent (if provided)
  useEffect(() => {
    if (
      props.inputValue !== undefined &&
      props.inputValue !== chat.input
    ) {
      chat.setInput(props.inputValue);
    }
  }, [props.inputValue, chat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    chat.handleInputChange(e);
    props.onInputChange?.(e.target.value);
  };

  // Function to programmatically submit a message
  const submitMessage = async (message?: string) => {
    if (chat.isLoading || intermediateStepsLoading) return;
    
    // If a message is provided, set it as the input
    if (message) {
      chat.setInput(message);
    }

    if (!showIntermediateSteps) {
      // Create a synthetic form submit event
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as FormEvent<HTMLFormElement>;
      
      await chat.handleSubmit(fakeEvent);
      props.onInputChange?.(""); // Clear input after submit
      return;
    }

    // For intermediate steps flow
    setIntermediateStepsLoading(true);

    const inputToSubmit = message || chat.input;
    chat.setInput("");
    const messagesWithUserReply = chat.messages.concat({
      id: chat.messages.length.toString(),
      content: inputToSubmit,
      role: "user",
    });
    chat.setMessages(messagesWithUserReply);

    const response = await fetch(props.endpoint, {
      method: "POST",
      body: JSON.stringify({
        messages: messagesWithUserReply,
        show_intermediate_steps: true,
        walletAddress: isConnected ? walletAddress : null,
      }),
    });
    const json = await response.json();
    setIntermediateStepsLoading(false);

    if (!response.ok) {
      toast.error(`Error while processing your request`, {
        description: json.error,
      });
      return;
    }

    const responseMessages: Message[] = json.messages;

    // Rest of the intermediate steps processing...
    const toolCallMessages = responseMessages.filter(
      (responseMessage: Message) => {
        return (
          (responseMessage.role === "assistant" &&
            !!responseMessage.tool_calls?.length) ||
          responseMessage.role === "tool"
        );
      },
    );

    const intermediateStepMessages = [];
    for (let i = 0; i < toolCallMessages.length; i += 2) {
      const aiMessage = toolCallMessages[i];
      const toolMessage = toolCallMessages[i + 1];
      intermediateStepMessages.push({
        id: (messagesWithUserReply.length + i / 2).toString(),
        role: "system" as const,
        content: JSON.stringify({
          action: aiMessage.tool_calls?.[0],
          observation: toolMessage.content,
        }),
      });
    }
    const newMessages = messagesWithUserReply;
    for (const message of intermediateStepMessages) {
      newMessages.push(message);
      chat.setMessages([...newMessages]);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000),
      );
    }

    chat.setMessages([
      ...newMessages,
      {
        id: newMessages.length.toString(),
        content: responseMessages[responseMessages.length - 1].content,
        role: "assistant",
      },
    ]);
  };

  // Original form submit handler
  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submitMessage();
    props.onInputChange?.("");
  }

  return (
    <ChatLayout
      content={
        chat.messages.length === 0 ? (
          <div>{props.emptyStateComponent}</div>
        ) : (
          <ChatMessages
            aiEmoji={props.emoji}
            messages={chat.messages}
            emptyStateComponent={props.emptyStateComponent}
            sourcesForMessages={sourcesForMessages}
          />
        )
      }
      footer={
        <>
          {props.suggestionButtons && (
            <div className="mb-4">{props.suggestionButtons}</div>
          )}
          <ChatInput
            value={chat.input}
            onChange={handleInputChange}
            onSubmit={handleFormSubmit}
            loading={chat.isLoading || intermediateStepsLoading}
            placeholder={props.placeholder ?? "What's it like to be a pirate?"}
            className="mb-4"
          >
            {props.showIngestForm && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="pl-2 pr-3 -ml-2"
                    disabled={chat.messages.length !== 0}
                  >
                    <Paperclip className="size-4" />
                    <span>Upload document</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload document</DialogTitle>
                    <DialogDescription>
                      Upload a document to use for the chat.
                    </DialogDescription>
                  </DialogHeader>
                  <UploadDocumentsForm />
                </DialogContent>
              </Dialog>
            )}

            {props.showIntermediateStepsToggle && (
              <div className="flex items-center gap-2">
                <Checkbox
                  className="border-black"
                  id="show_intermediate_steps"
                  name="show_intermediate_steps"
                  checked={showIntermediateSteps}
                  disabled={chat.isLoading || intermediateStepsLoading}
                  onCheckedChange={(e) => setShowIntermediateSteps(!!e)}
                />
                <label htmlFor="show_intermediate_steps" className="text-sm">
                  Show intermediate steps
                </label>
              </div>
            )}
          </ChatInput>
        </>
      }
    />
  );
}
