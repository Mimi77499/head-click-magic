import { useRef, useEffect } from 'react';
import { Category } from '@/data/symbolsData';

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
      className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategory;
        
        return (
          <button
            key={category.id}
            ref={isActive ? activeTabRef : null}
            onClick={() => onCategoryChange(category.id)}
            className={`category-tab flex-shrink-0 ${isActive ? 'category-tab-active' : ''}`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xs font-medium whitespace-nowrap">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
