import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  speechPitch: number;
  onSpeechPitchChange: (pitch: number) => void;
  autoSpeak: boolean;
  onAutoSpeakChange: (enabled: boolean) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  largeText: boolean;
  onLargeTextChange: (enabled: boolean) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  speechRate,
  onSpeechRateChange,
  speechPitch,
  onSpeechPitchChange,
  autoSpeak,
  onAutoSpeakChange,
  highContrast,
  onHighContrastChange,
  largeText,
  onLargeTextChange,
}: SettingsPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            ⚙️ Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Speech Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Speech Settings
            </h3>

            {/* Speech Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-rate">Speech Speed</Label>
                <span className="text-sm text-muted-foreground">
                  {speechRate.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="speech-rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechRate]}
                onValueChange={([value]) => onSpeechRateChange(value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            {/* Speech Pitch */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-pitch">Voice Pitch</Label>
                <span className="text-sm text-muted-foreground">
                  {speechPitch.toFixed(1)}
                </span>
              </div>
              <Slider
                id="speech-pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechPitch]}
                onValueChange={([value]) => onSpeechPitchChange(value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>

            {/* Auto Speak */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="auto-speak">Auto Speak</Label>
                <p className="text-xs text-muted-foreground">
                  Speak automatically when tapping symbols
                </p>
              </div>
              <Switch
                id="auto-speak"
                checked={autoSpeak}
                onCheckedChange={onAutoSpeakChange}
              />
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Accessibility
            </h3>

            {/* High Contrast */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-xs text-muted-foreground">
                  Increase color contrast for visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={onHighContrastChange}
              />
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="large-text">Large Text</Label>
                <p className="text-xs text-muted-foreground">
                  Increase text size throughout the app
                </p>
              </div>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={onLargeTextChange}
              />
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              About
            </h3>
            <div className="p-4 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <p className="font-bold">SayIt</p>
                  <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                An AAC (Augmentative and Alternative Communication) app designed to help 
                people communicate through symbols and speech synthesis.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
