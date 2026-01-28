import { useState } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { languages, Language, getLanguageByCode, getNigerianLanguages, getAfricanLanguages } from '@/data/languagesData';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentLang = getLanguageByCode(selectedLanguage);
  
  const nigerianLangs = getNigerianLanguages();
  const africanLangs = getAfricanLanguages().filter(l => !nigerianLangs.some(n => n.code === l.code));
  const otherLangs = languages.filter(l => 
    !nigerianLangs.some(n => n.code === l.code) && 
    !africanLangs.some(a => a.code === l.code)
  );

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setOpen(false);
  };

  const LanguageItem = ({ lang }: { lang: Language }) => (
    <button
      onClick={() => handleSelect(lang.code)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
        selectedLanguage === lang.code 
          ? 'bg-primary/15 text-primary' 
          : 'hover:bg-muted'
      }`}
    >
      <span className="text-xl">{lang.flag}</span>
      <div className="flex-1 text-left">
        <p className="font-medium text-sm">{lang.name}</p>
        <p className="text-xs text-muted-foreground">{lang.nativeName}</p>
      </div>
      {selectedLanguage === lang.code && (
        <Check className="w-4 h-4 text-primary" />
      )}
    </button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-full gap-2 px-4"
        >
          <span className="text-lg">{currentLang?.flag || '🌐'}</span>
          <span className="hidden sm:inline">{currentLang?.name || 'Select'}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <ScrollArea className="h-[400px]">
          {/* Nigerian Languages */}
          <div className="mb-4">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              🇳🇬 Nigerian Languages
            </p>
            {nigerianLangs.map(lang => (
              <LanguageItem key={lang.code} lang={lang} />
            ))}
          </div>

          {/* Other African Languages */}
          <div className="mb-4">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              🌍 African Languages
            </p>
            {africanLangs.map(lang => (
              <LanguageItem key={lang.code} lang={lang} />
            ))}
          </div>

          {/* Other Languages */}
          <div>
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3 h-3" /> Other Languages
            </p>
            {otherLangs.map(lang => (
              <LanguageItem key={lang.code} lang={lang} />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

