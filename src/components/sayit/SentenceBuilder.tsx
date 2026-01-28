import { Trash2, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Symbol } from '@/data/symbolsData';
import { motion, AnimatePresence } from 'framer-motion';

interface SentenceBuilderProps {
  selectedSymbols: Symbol[];
  onClear: () => void;
  onRemoveSymbol: (index: number) => void;
  onSpeak: () => void;
  onEnhance: () => void;
  isSpeaking: boolean;
  enhancedText?: string;
}

export function SentenceBuilder({
  selectedSymbols,
  onClear,
  onRemoveSymbol,
  onSpeak,
  onEnhance,
  isSpeaking,
  enhancedText,
}: SentenceBuilderProps) {
  const hasSymbols = selectedSymbols.length > 0;
  const displayText = enhancedText || selectedSymbols.map(s => s.text).join(' ');

  return (
    <div className="bg-card rounded-3xl border-2 border-border shadow-soft p-4 md:p-6">
      {/* Instruction */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-foreground">
          👋 Tap symbols below to build a sentence
        </p>
        <p className="text-sm text-muted-foreground">
          AI will help make it sound natural
        </p>
      </div>

      {/* Sentence display area */}
      <div 
        className={`min-h-[80px] rounded-2xl border-2 border-dashed p-4 mb-4 transition-all ${
          hasSymbols 
            ? 'border-primary/40 bg-primary/5' 
            : 'border-muted-foreground/30 bg-muted/30'
        }`}
      >
        {hasSymbols ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {selectedSymbols.map((symbol, index) => (
                <motion.button
                  key={`${symbol.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, type: 'spring' }}
                  onClick={() => onRemoveSymbol(index)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 hover:bg-destructive/15 text-foreground font-medium transition-colors group"
                >
                  <span className="text-xl">{symbol.emoji}</span>
                  <span>{symbol.text}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-destructive">×</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-muted-foreground italic">
            Your sentence will appear here...
          </p>
        )}
      </div>

      {/* Enhanced text display */}
      {enhancedText && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/30"
        >
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Enhanced:
          </p>
          <p className="text-foreground font-medium">{enhancedText}</p>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={!hasSymbols}
          className="rounded-full gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onEnhance}
          disabled={!hasSymbols}
          className="rounded-full gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Enhance
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSpeak}
          disabled={!hasSymbols || isSpeaking}
          className="rounded-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
          {isSpeaking ? 'Speaking...' : 'Speak'}
        </Button>
      </div>
    </div>
  );
}
