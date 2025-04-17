import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import ToolResult from './ToolResult';

const components: Partial<Components> = {
  // @ts-expect-error
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4 text-[#661700]" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1 text-[#661700]" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4 text-[#661700]" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold text-[#661700]" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2 text-[#661700]" {...props}>
        {children}
      </h6>
    );
  },
  p: ({ node, children, ...props }) => {
    return (
      <p className="text-[#661700]" {...props}>
        {children}
      </p>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  // Process tool results before passing content to ReactMarkdown
  const processedContent = React.useMemo(() => {
    // Split content by tool-result tags
    const parts = children.split(/<tool-result>|<\/tool-result>/);
    
    if (parts.length <= 1) {
      return { parts: [children], toolResults: [] }; // No tool results found
    }
    
    const textParts: string[] = [];
    const toolResults: string[] = [];
    
    // Separate regular text and tool results
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular markdown content
        textParts.push(parts[i]);
      } else {
        // Tool result content
        toolResults.push(parts[i]);
      }
    }
    
    return { parts: textParts, toolResults };
  }, [children]);
  
  const { parts, toolResults } = processedContent;
  
  // Render the content with interleaved tool results
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={`part-${index}`}>
          {part && (
            <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
              {part}
            </ReactMarkdown>
          )}
          {toolResults[index] && <ToolResult content={toolResults[index]} />}
        </React.Fragment>
      ))}
    </>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);