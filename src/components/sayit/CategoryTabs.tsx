import { useRef, useEffect } from 'react';
import { Category } from '@/data/symbolsData';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeTab = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      
      const scrollTo = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div 
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategory;
        
        return (
          <motion.button
            key={category.id}
            ref={isActive ? activeTabRef : null}
            onClick={() => onCategoryChange(category.id)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl min-w-[80px] transition-all duration-200 ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-button' 
                : 'bg-card hover:bg-muted text-foreground'
            }`}
            style={{
              '--cat-color': category.color,
            } as React.CSSProperties}
          >
            <span className="text-2xl">{category.icon}</span>
            <span className={`text-xs font-semibold whitespace-nowrap ${
              isActive ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}>
              {category.name}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-2xl -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
