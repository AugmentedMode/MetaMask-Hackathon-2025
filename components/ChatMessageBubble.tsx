import { cn } from "@/utils/cn";
import type { Message } from "ai/react";
import { Markdown } from "./Markdown";
import Image from "next/image";

export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
}) {
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
        <Markdown>{props.message.content}</Markdown>

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
