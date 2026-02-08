import { Settings, History, Eye, Volume2, MessageSquare } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary via-secondary to-accent shadow-lg border-b-4 border-primary/30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">SayIt</h1>
            <p className="text-xs text-white/80">Accessible Communication</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Voice selector button */}
          {onVoiceClick && (
            <button
              onClick={onVoiceClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 text-white text-sm font-medium"
              title="Change voice"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentVoice}</span>
            </button>
          )}
          
          {/* Head tracking toggle */}
          <button
            onClick={onHeadTrackingClick}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isHeadTrackingActive
                ? 'bg-white/30 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
            title={isHeadTrackingActive ? 'Disable head tracking' : 'Enable head tracking'}
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* History */}
          <button
            onClick={onHistoryClick}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/80 hover:text-white"
            title="History"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/80 hover:text-white"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}