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
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
      {symbols.map((symbol, idx) => {
        const selected = isSelected(symbol.id);
        
        return (
          <button
            key={symbol.id}
            onClick={() => onSymbolClick(symbol)}
            style={{
              animationDelay: `${idx * 0.03}s`,
            }}
            className={`
              animate-fade-in group relative p-3 rounded-2xl font-semibold text-center transition-all duration-300 transform
              ${
                selected
                  ? 'bg-gradient-to-br from-primary to-secondary shadow-lg scale-105 ring-2 ring-offset-2 ring-primary/50'
                  : 'bg-white border-2 border-orange-200 hover:border-primary hover:shadow-lg hover:scale-110 hover:bg-gradient-to-br hover:from-primary/10 hover:to-secondary/10'
              }
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            `}
            title={symbol.text}
          >
            {/* Glow effect for selected */}
            {selected && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/40 to-secondary/40 blur-lg -z-10 animate-pulse" />
            )}
            
            {/* Icon */}
            <span className={`
              text-2xl sm:text-3xl md:text-4xl block mb-1.5 transition-transform duration-300
              ${selected ? 'scale-125 animate-bounce' : 'group-hover:scale-110'}
            `}>
              {symbol.emoji}
            </span>
            
            {/* Label */}
            <span className={`
              text-[10px] sm:text-xs font-bold text-center leading-tight line-clamp-2 transition-colors duration-300
              ${selected ? 'text-white drop-shadow-lg' : 'text-orange-900 group-hover:text-primary'}
            `}>
              {symbol.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
