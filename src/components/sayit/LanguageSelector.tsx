import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { languages, Language, getNigerianLanguages, getAfricanLanguages } from '@/data/languagesData';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const nigerianLangs = getNigerianLanguages();
  const africanLangs = getAfricanLanguages().filter(l => !nigerianLangs.some(n => n.code === l.code));
  const otherLangs = languages.filter(l => 
    !nigerianLangs.some(n => n.code === l.code) && 
    !africanLangs.some(a => a.code === l.code)
  );

  const LanguageItem = ({ lang }: { lang: Language }) => (
    <button
      onClick={() => onLanguageChange(lang.code)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        selectedLanguage === lang.code 
          ? 'bg-primary/15 text-primary' 
          : 'hover:bg-muted'
      }`}
    >
      <span className="text-lg">{lang.flag}</span>
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
    <ScrollArea className="h-[350px]">
      {/* Nigerian Languages */}
      <div className="mb-3">
        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          🇳🇬 Nigerian Languages
        </p>
        {nigerianLangs.map(lang => (
          <LanguageItem key={lang.code} lang={lang} />
        ))}
      </div>

      {/* Other African Languages */}
      <div className="mb-3">
        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          🌍 African Languages
        </p>
        {africanLangs.map(lang => (
          <LanguageItem key={lang.code} lang={lang} />
        ))}
      </div>

      {/* Other Languages */}
      <div>
        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          🌐 Other Languages
        </p>
        {otherLangs.map(lang => (
          <LanguageItem key={lang.code} lang={lang} />
        ))}
      </div>
    </ScrollArea>
  );
}
