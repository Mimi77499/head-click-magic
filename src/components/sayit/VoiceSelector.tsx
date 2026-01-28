import { Check, Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onTestVoice: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ 
  voices, 
  selectedVoice, 
  onVoiceChange,
  onTestVoice 
}: VoiceSelectorProps) {
  // Group voices by language
  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0].toUpperCase();
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  // Sort languages alphabetically, but put English first
  const sortedLangs = Object.keys(groupedVoices).sort((a, b) => {
    if (a === 'EN') return -1;
    if (b === 'EN') return 1;
    return a.localeCompare(b);
  });

  const getVoiceQualityBadge = (voice: SpeechSynthesisVoice) => {
    if (voice.name.includes('Google') || voice.name.includes('Microsoft')) {
      return <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">HD</span>;
    }
    if (voice.name.includes('Premium') || voice.name.includes('Enhanced')) {
      return <span className="text-[10px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded-full">Premium</span>;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 mb-3">
        <p className="text-xs font-medium text-muted-foreground">Select Voice</p>
        <p className="text-xs text-muted-foreground">{voices.length} voices</p>
      </div>
      
      <ScrollArea className="h-[350px]">
        {sortedLangs.map(lang => (
          <div key={lang} className="mb-4">
            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background z-10">
              {lang}
            </p>
            <div className="space-y-0.5">
              {groupedVoices[lang].map((voice, idx) => (
                <div
                  key={`${voice.name}-${idx}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedVoice?.name === voice.name 
                      ? 'bg-primary/15 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <button
                    onClick={() => onVoiceChange(voice)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate max-w-[180px]">
                          {voice.name.replace(/Microsoft |Google |Apple /, '')}
                        </p>
                        {getVoiceQualityBadge(voice)}
                      </div>
                      <p className="text-xs text-muted-foreground">{voice.lang}</p>
                    </div>
                    {selectedVoice?.name === voice.name && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTestVoice(voice);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/20 transition-colors"
                    title="Test voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {voices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No voices available</p>
            <p className="text-xs mt-1">Your browser may not support speech synthesis</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
