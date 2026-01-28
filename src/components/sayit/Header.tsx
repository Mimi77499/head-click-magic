import { Settings, History, Eye, Volume2 } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onHeadTrackingClick: () => void;
  isHeadTrackingActive: boolean;
  onVoiceClick?: () => void;
  currentVoice?: string;
}

export function Header({ 
  onSettingsClick, 
  onHistoryClick, 
  onHeadTrackingClick, 
  isHeadTrackingActive,
  onVoiceClick,
  currentVoice = 'Voice'
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-3 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗣️</span>
          <h1 className="text-xl font-bold text-foreground">SayIt</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Voice selector button */}
          {onVoiceClick && (
            <button
              onClick={onVoiceClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              title="Change voice"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentVoice}</span>
            </button>
          )}
          
          {/* Head tracking toggle */}
          <button
            onClick={onHeadTrackingClick}
            className={`p-2 rounded-lg transition-colors ${
              isHeadTrackingActive 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
            title={isHeadTrackingActive ? 'Disable head tracking' : 'Enable head tracking'}
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* History */}
          <button
            onClick={onHistoryClick}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="History"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
