import { useState, useCallback } from 'react';
import { getSuggestedPhrases, Suggestion } from '@/integrations/gemini/suggestions';
import { Symbol } from '@/data/symbolsData';

export interface HistoryEntry {
  role: 'user' | 'other';
  text: string;
}

export function useGeminiSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(
    async (
      currentSymbols: Symbol[],
      history: HistoryEntry[],
      category?: string
    ) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getSuggestedPhrases(currentSymbols, history, category);
        setSuggestions(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate suggestions';
        setError(message);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    generateSuggestions,
    clearSuggestions,
  };
}
