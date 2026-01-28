import { Trash2, Volume2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
  language: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSpeakItem: (text: string) => void;
  onSelectItem: (text: string) => void;
}

export function HistoryPanel({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSpeakItem,
  onSelectItem,
}: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  };

  // Group history by date
  const groupedHistory = history.reduce((groups, item) => {
    const dateKey = item.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              History
            </SheetTitle>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No history yet</p>
              <p className="text-sm text-muted-foreground">
                Your spoken sentences will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([dateKey, items]) => (
                  <div key={dateKey}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {formatDate(new Date(dateKey))}
                    </p>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <button
                            onClick={() => onSelectItem(item.text)}
                            className="w-full text-left"
                          >
                            <p className="font-medium text-foreground mb-1">
                              {item.text}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(item.timestamp)}
                            </p>
                          </button>
                          <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSpeakItem(item.text)}
                              className="h-8 px-3"
                            >
                              <Volume2 className="w-4 h-4 mr-1" />
                              Speak
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
