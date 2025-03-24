import { cn } from "@/utils/cn";
import type { Message } from "ai/react";
import { Markdown } from "./Markdown";
import Image from "next/image";
import { useEffect } from "react";

// Helper function to try parsing message content as JSON
const tryParseJSON = (content: string) => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
};

export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
}) {
  // Check if the message contains a bridge URL to automatically open
  useEffect(() => {
    if (props.message.role === "assistant") {
      // Try to parse the message content as JSON
      const parsedContent = tryParseJSON(props.message.content);
      
      // If content is valid JSON, contains autoOpen flag and a URL, open it
      if (parsedContent && parsedContent.autoOpen === true && parsedContent.url) {
        window.open(parsedContent.url, '_blank');
      }
    }
  }, [props.message]);

  // Format the message content for display
  const displayContent = () => {
    if (props.message.role === "assistant") {
      const parsedContent = tryParseJSON(props.message.content);
      
      // If content is JSON with a message field, display that instead of raw JSON
      if (parsedContent && parsedContent.message) {
        return parsedContent.message;
      }
    }
    
    // Otherwise show the original content
    return props.message.content;
  };

  return (
    <div
      className={cn(
        `rounded-[24px] max-w-[80%] mb-8 flex`,
        props.message.role === "user"
          ? "bg-[#FFA680] text-secondary-foreground px-4 py-2"
          : null,
        props.message.role === "user" ? "ml-auto" : "mr-auto",
      )}
    >
      {props.message.role !== "user" && (
        <div className="p-3 mr-4 -mt-2 rounded-2xl h-[64px] w-[64px] flex-shrink-0 flex items-center justify-center bg-secondary overflow-hidden">
          <Image 
            src="/images/MetaMask-icon-Fox.svg" 
            alt="Fox Logo" 
            width={42} 
            height={42}
            className="object-contain"
          />
        </div>
      )}

      <div className="flex flex-col">
        <Markdown>{displayContent()}</Markdown>

        {props.sources && props.sources.length ? (
          <>
            <code className="mt-4 mr-auto bg-primary px-2 py-1 rounded">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mt-1 mr-2 bg-primary px-2 py-1 rounded text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </code>
          </>
        ) : null}
      </div>
    </div>
  );
}
