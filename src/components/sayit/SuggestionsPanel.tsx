import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Suggestion } from '@/integrations/gemini/suggestions';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  isLoading: boolean;
  onSuggestionClick: (text: string) => void;
}

export function SuggestionsPanel({
  suggestions,
  isLoading,
  onSuggestionClick,
}: SuggestionsPanelProps) {
  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3 border-b border-orange-200/50">
        <CardTitle className="flex items-center gap-2 text-base text-orange-900 font-bold">
          <div className="p-1.5 bg-orange-400/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-orange-600" />
          </div>
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500 mr-3" />
            <span className="text-sm font-medium text-orange-700">Thinking...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => onSuggestionClick(suggestion.text)}
                className="justify-start text-left h-auto py-3 px-4 border-orange-300 border-2 hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-100 to-amber-100 hover:shadow-md transition-all duration-200 group"
                title={suggestion.reason}
              >
                <div className="flex-1">
                  <span className="text-sm font-semibold text-orange-900 group-hover:text-orange-700 block truncate">
                    {suggestion.text}
                  </span>
                  <span className="text-xs text-orange-600/70 group-hover:text-orange-600">
                    {suggestion.reason}
                  </span>
                </div>
                <span className="ml-2 text-xs font-bold bg-orange-400/20 px-2.5 py-1 rounded-lg text-orange-700 group-hover:bg-orange-400/40">
                  {(suggestion.confidence * 100).toFixed(0)}%
                </span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
