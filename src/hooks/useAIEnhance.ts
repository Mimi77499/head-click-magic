import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAIEnhanceOptions {
  onSuccess?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useAIEnhance(options: UseAIEnhanceOptions = {}) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhance = useCallback(async (
    symbols: string,
    tone: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string | null> => {
    if (!symbols.trim()) return null;
    
    setIsEnhancing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('enhance-text', {
        body: { symbols, tone, targetLanguage, sourceLanguage }
      });

      if (error) {
        console.error('AI enhance error:', error);
        toast.error('Failed to enhance text. Using original.');
        options.onError?.(error.message);
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        options.onError?.(data.error);
        return null;
      }

      const enhancedText = data?.enhancedText;
      if (enhancedText) {
        options.onSuccess?.(enhancedText);
        return enhancedText;
      }
      
      return null;
    } catch (err) {
      console.error('AI enhance exception:', err);
      toast.error('Failed to connect to AI service');
      options.onError?.(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsEnhancing(false);
    }
  }, [options]);

  return { enhance, isEnhancing };
}
