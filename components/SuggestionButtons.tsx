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
    <div className="flex flex-wrap justify-center gap-4 max-w-[900px] mx-auto mb-6 mt-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="bg-slate-100 text-primary hover:bg-slate-200 text-sm transition-colors rounded-md font-medium border-0 px-5 py-2.5"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
} 