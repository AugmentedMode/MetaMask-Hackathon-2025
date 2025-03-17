import { useState } from "react";
import type { Message } from "ai/react";
import { cn } from "@/utils/cn";
import { ChevronDown, ChevronUp } from "lucide-react";

export function IntermediateStep(props: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  
  // Handle parsing the message - if it's JSON, parse it, otherwise use as-is
  let parsedInput;
  let action;
  let observation;
  
  try {
    parsedInput = JSON.parse(props.message.content);
    action = parsedInput.action;
    observation = parsedInput.observation;
  } catch (e) {
    // If it's not valid JSON, just use the content as-is
    action = { name: "Step" };
    observation = props.message.content;
  }
  
  // Function to strip Markdown formatting for the collapsed view
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\n\n/g, ' ') // Replace double line breaks with a space
      .split('\n')[0];      // Only show the first line
  };
  
  // Get an emoji based on the action name
  const getEmoji = (actionName: string) => {
    if (!actionName) return '📋';
    
    if (actionName.includes('price')) return '💰';
    if (actionName.includes('yield')) return '📈';
    if (actionName.includes('portfolio')) return '💼';
    if (actionName.includes('transaction')) return '🔄';
    if (actionName.includes('gas')) return '⛽';
    if (actionName.includes('identity')) return '🔍';
    if (actionName.includes('tvl')) return '📊';
    
    return '🤖';
  };
  
  const emoji = getEmoji(action?.name || '');
  
  // Create a more readable action name
  const getReadableActionName = (actionName: string) => {
    if (!actionName) return 'Processing';
    
    // Remove prefixes and convert to title case
    return actionName
      .replace(/_/g, ' ')
      .replace(/get|analyze|search|resolve/g, '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const actionName = getReadableActionName(action?.name || '');
  
  // For observation, if it's already in human-readable format, show it directly
  // Otherwise, try to create a summary for collapsed view
  let summaryText = typeof observation === 'string' ? 
    stripMarkdown(observation) : 
    'Processing data...';
    
  // Truncate summary if it's too long
  if (summaryText.length > 60) {
    summaryText = summaryText.substring(0, 60) + '...';
  }
  
  return (
    <div className="mr-auto bg-secondary border border-input rounded p-3 max-w-[80%] mb-8 whitespace-pre-wrap flex flex-col">
      <button
        type="button"
        className={cn(
          "text-left flex items-center gap-1",
          expanded && "w-full",
        )}
        onClick={(e) => setExpanded(!expanded)}
      >
        <span className="flex items-center">
          {emoji} <strong className="ml-2 font-mono">{actionName}</strong>
        </span>
        {!expanded && (
          <span className="ml-2 text-sm text-gray-500 truncate">{summaryText}</span>
        )}
        <span className="ml-auto">
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>
      
      <div
        className={cn(
          "overflow-hidden max-h-[0px] transition-[max-height] ease-in-out text-sm",
          expanded && "max-h-[800px]",
        )}
      >
        <div className="mt-3">
          {typeof observation === 'string' ? (
            <div className="whitespace-pre-line">{observation}</div>
          ) : (
            <pre className="p-2 rounded bg-gray-100 dark:bg-gray-800 overflow-auto">
              {JSON.stringify(observation, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
