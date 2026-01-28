import { Symbol } from '@/data/symbolsData';

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
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
      {symbols.map((symbol) => {
        const selected = isSelected(symbol.id);
        
        return (
          <button
            key={symbol.id}
            onClick={() => onSymbolClick(symbol)}
            className={`symbol-card ${selected ? 'symbol-card-selected' : ''}`}
          >
            <span className="text-2xl md:text-3xl">{symbol.emoji}</span>
            <span className="text-[10px] md:text-xs font-medium text-center text-foreground leading-tight line-clamp-2">
              {symbol.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
