import { Settings, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onHeadTrackingClick: () => void;
  isHeadTrackingActive: boolean;
}

export function Header({ 
  onSettingsClick, 
  onHistoryClick, 
  onHeadTrackingClick,
  isHeadTrackingActive 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <span className="text-xl">💬</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              SayIt
            </h1>
            <span className="text-xs text-muted-foreground -mt-1">
              Communication Made Easy
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onHeadTrackingClick}
            className={`rounded-xl transition-colors ${isHeadTrackingActive ? 'bg-primary/10 text-primary' : ''}`}
            title="Hands-free mode"
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onHistoryClick}
            className="rounded-xl"
            title="History"
          >
            <Clock className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="rounded-xl"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
