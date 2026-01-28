import { Check } from 'lucide-react';

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
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Select Tone</p>
      {tones.map(tone => (
        <button
          key={tone.id}
          onClick={() => onToneChange(tone.id)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selectedTone === tone.id 
              ? 'bg-primary/15 text-primary' 
              : 'hover:bg-muted'
          }`}
        >
          <span className="text-lg">{tone.icon}</span>
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
  );
}

export { tones };
