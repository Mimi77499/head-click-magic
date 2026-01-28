import { Symbol } from '@/data/symbolsData';
import { motion } from 'framer-motion';

interface SymbolGridProps {
  symbols: Symbol[];
  onSymbolClick: (symbol: Symbol) => void;
  selectedSymbols: Symbol[];
}

export function SymbolGrid({ symbols, onSymbolClick, selectedSymbols }: SymbolGridProps) {
  const isSelected = (symbolId: string) => {
    return selectedSymbols.some(s => s.id === symbolId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3"
    >
      {symbols.map((symbol, index) => {
        const selected = isSelected(symbol.id);
        
        return (
          <motion.button
            key={symbol.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSymbolClick(symbol)}
            className={`flex flex-col items-center justify-center gap-1 p-3 md:p-4 rounded-2xl bg-card border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
              selected 
                ? 'border-primary bg-primary/10 shadow-button' 
                : 'border-transparent hover:border-primary/30'
            }`}
          >
            <span className="text-3xl md:text-4xl">{symbol.emoji}</span>
            <span className="text-xs md:text-sm font-medium text-center text-foreground leading-tight">
              {symbol.text}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
