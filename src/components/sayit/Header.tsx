import { Clock, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onHeadTrackingClick?: () => void;
  isHeadTrackingActive?: boolean;
}

export function Header({ 
  onSettingsClick, 
  onHistoryClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">S</span>
          </div>
          <span className="text-lg font-bold text-foreground">SayIt</span>
          <span className="text-primary font-bold">—</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onHistoryClick}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="History"
          >
            <Clock className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
