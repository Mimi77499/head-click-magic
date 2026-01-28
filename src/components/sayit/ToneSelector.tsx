import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface Tone {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const tones: Tone[] = [
  { id: 'neutral', name: 'Neutral', icon: '😐', description: 'Clear and straightforward' },
  { id: 'friendly', name: 'Friendly', icon: '😊', description: 'Warm and approachable' },
  { id: 'formal', name: 'Formal', icon: '👔', description: 'Professional and polite' },
  { id: 'casual', name: 'Casual', icon: '😎', description: 'Relaxed and informal' },
  { id: 'urgent', name: 'Urgent', icon: '⚡', description: 'Important and immediate' },
  { id: 'gentle', name: 'Gentle', icon: '🌸', description: 'Soft and caring' },
];

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (toneId: string) => void;
}

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentTone = tones.find(t => t.id === selectedTone) || tones[0];

  const handleSelect = (toneId: string) => {
    onToneChange(toneId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-full gap-2 px-4"
        >
          <span className="text-lg">{currentTone.icon}</span>
          <span className="hidden sm:inline">{currentTone.name}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="center">
        <div className="space-y-1">
          {tones.map(tone => (
            <button
              key={tone.id}
              onClick={() => handleSelect(tone.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                selectedTone === tone.id 
                  ? 'bg-primary/15 text-primary' 
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-xl">{tone.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{tone.name}</p>
                <p className="text-xs text-muted-foreground">{tone.description}</p>
              </div>
              {selectedTone === tone.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { tones };
