import React from 'react';
import { Button } from './ui/button';

interface SuggestionButtonsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export function SuggestionButtons({ 
  suggestions, 
  onSuggestionClick
}: SuggestionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 max-w-[768px] mx-auto mb-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-sm transition-colors"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
} 