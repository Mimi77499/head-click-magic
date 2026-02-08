import { Trash2, Sparkles, Volume2, ChevronDown, Loader2, Mic } from 'lucide-react';
import { Symbol } from '@/data/symbolsData';
import { motion, AnimatePresence } from 'framer-motion';

interface SentenceBuilderProps {
  selectedSymbols: Symbol[];
  onClear: () => void;
  onRemoveSymbol: (index: number) => void;
  onSpeak: () => void;
  onEnhance: () => void;
  isSpeaking: boolean;
  isEnhancing?: boolean;
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
  isEnhancing = false,
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
    excited: '🎉',
  };

  return (
    <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-3xl border-2 border-orange-200 p-4 md:p-6 shadow-lg">
      {/* Header text */}
      <div className="text-center mb-5">
        <p className="text-lg font-bold text-orange-900 flex items-center justify-center gap-2">
          <span className="text-2xl">👋</span>
          Tap symbols to build your message
        </p>
        <p className="text-sm text-orange-700/70 mt-1">
          AI helps make it sound natural
        </p>
      </div>

      {/* Sentence display area - Beautiful gradient box */}
      <div 
        className={`
          min-h-[80px] rounded-2xl border-3 p-4 mb-4 transition-all duration-300
          ${
            hasSymbols 
              ? 'border-primary bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 shadow-md' 
              : 'border-dashed border-orange-300 bg-orange-50'
          }
        `}
      >
        {hasSymbols ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {selectedSymbols.map((symbol, index) => (
                <motion.button
                  key={`${symbol.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onRemoveSymbol(index)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group"
                  title="Click to remove"
                >
                  <span className="text-lg">{symbol.emoji}</span>
                  <span>{symbol.text}</span>
                  <span className="text-white/80 group-hover:text-white ml-1 font-bold">×</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-orange-600/60 text-sm italic font-medium">
            Your message will appear here...
          </p>
        )}
      </div>

      {/* Enhanced text display */}
      {enhancedText && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 shadow-md"
        >
          <p className="text-xs font-bold text-amber-800 mb-1.5 flex items-center gap-2">
            <span className="p-1 bg-amber-400/30 rounded-lg">
              <Sparkles className="w-3 h-3" />
            </span>
            AI Enhanced:
          </p>
          <p className="text-foreground text-base font-bold text-amber-900">{enhancedText}</p>
        </motion.div>
      )}

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Clear button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          disabled={!hasSymbols}
          className="
            px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-lg border-2 border-red-300
          "
          title="Clear all symbols"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </motion.button>

        {/* AI Enhance */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnhance}
          disabled={!hasSymbols || isEnhancing}
          className="
            px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-amber-100 text-amber-700 hover:bg-amber-200 hover:shadow-lg border-2 border-amber-300
          "
        >
          {isEnhancing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>AI</span>
        </motion.button>

        {/* Tone selector */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToneClick}
          className="
            px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-lg border-2 border-blue-300
          "
        >
          <span>{toneIcons[selectedTone] || '😐'}</span>
          <span>Tone</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </motion.button>

        {/* Language/Translate selector */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLanguageClick}
          className="
            px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2
            bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-lg border-2 border-purple-300
          "
        >
          <span>{languageFlag}</span>
          <span>Translate</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </motion.button>

        {/* Speak button - Primary */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSpeak}
          disabled={!hasSymbols || isSpeaking}
          className="
            px-5 py-2.5 rounded-full font-bold text-base transition-all duration-300 flex items-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl hover:shadow-primary/40
            border-2 border-primary/50
          "
        >
          <Mic className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
          <span>Speak</span>
        </motion.button>
      </div>
    </div>
  );
}
