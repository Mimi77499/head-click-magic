import { Trash2, Sparkles, Volume2 } from 'lucide-react';
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
  selectedTone: string;
  onToneClick: () => void;
  selectedLanguage: string;
  onLanguageClick: () => void;
  languageFlag: string;
}

export function SentenceBuilder({
  selectedSymbols,
  onClear,
  onRemoveSymbol,
  onSpeak,
  onEnhance,
  isSpeaking,
  enhancedText,
  selectedTone,
  onToneClick,
  selectedLanguage,
  onLanguageClick,
  languageFlag,
}: SentenceBuilderProps) {
  const hasSymbols = selectedSymbols.length > 0;

  // Get tone icon
  const toneIcons: Record<string, string> = {
    neutral: '😐',
    friendly: '😊',
    formal: '👔',
    casual: '😎',
    urgent: '⚡',
    gentle: '🌸',
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
      {/* Header text */}
      <div className="text-center mb-4">
        <p className="text-base font-medium text-foreground flex items-center justify-center gap-2">
          <span>👋</span>
          Tap symbols below to build a sentence
        </p>
        <p className="text-sm text-muted-foreground">
          AI will help make it sound natural
        </p>
      </div>

      {/* Sentence display area */}
      <div 
        className={`min-h-[60px] rounded-xl border-2 border-dashed p-3 mb-4 transition-all ${
          hasSymbols 
            ? 'border-primary/30 bg-primary/5' 
            : 'border-muted-foreground/20 bg-muted/30'
        }`}
      >
        {hasSymbols ? (
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence mode="popLayout">
              {selectedSymbols.map((symbol, index) => (
                <motion.button
                  key={`${symbol.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onRemoveSymbol(index)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-destructive/10 text-foreground text-sm font-medium transition-colors group"
                >
                  <span>{symbol.emoji}</span>
                  <span>{symbol.text}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-destructive ml-0.5">×</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm italic">
            Your sentence will appear here...
          </p>
        )}
      </div>

      {/* Enhanced text display */}
      {enhancedText && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2.5 rounded-lg bg-accent/10 border border-accent/20"
        >
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Enhanced:
          </p>
          <p className="text-foreground text-sm font-medium">{enhancedText}</p>
        </motion.div>
      )}

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Clear button */}
        <button
          onClick={onClear}
          disabled={!hasSymbols}
          className="action-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* AI Enhance */}
        <button
          onClick={onEnhance}
          disabled={!hasSymbols}
          className="action-btn disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI</span>
        </button>

        {/* Tone selector */}
        <button
          onClick={onToneClick}
          className="action-btn"
        >
          <span>{toneIcons[selectedTone] || '😐'}</span>
          <span>Tone</span>
        </button>

        {/* Language selector */}
        <button
          onClick={onLanguageClick}
          className="action-btn"
        >
          <span>{languageFlag}</span>
          <span>Translate</span>
        </button>

        {/* Speak button */}
        <button
          onClick={onSpeak}
          disabled={!hasSymbols || isSpeaking}
          className="action-btn action-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
          <span>Speak</span>
        </button>
      </div>
    </div>
  );
}
