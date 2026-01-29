import { useState, useCallback } from 'react';
import { Header } from '@/components/sayit/Header';
import { SentenceBuilder } from '@/components/sayit/SentenceBuilder';
import { CategoryTabs } from '@/components/sayit/CategoryTabs';
import { SymbolGrid } from '@/components/sayit/SymbolGrid';
import { SettingsPanel } from '@/components/sayit/SettingsPanel';
import { HistoryPanel, HistoryItem } from '@/components/sayit/HistoryPanel';
import { HeadTrackingOverlay } from '@/components/HeadTrackingOverlay';
import { ToneSelector } from '@/components/sayit/ToneSelector';
import { LanguageSelector } from '@/components/sayit/LanguageSelector';
import { VoiceSelector } from '@/components/sayit/VoiceSelector';
import { useSpeech } from '@/hooks/useSpeech';
import { useAIEnhance } from '@/hooks/useAIEnhance';
import { categories, getSymbolsByCategory, Symbol } from '@/data/symbolsData';
import { getLanguageByCode } from '@/data/languagesData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export default function SayIt() {
  const [activeCategory, setActiveCategory] = useState('phrases');
  const [selectedSymbols, setSelectedSymbols] = useState<Symbol[]>([]);
  const [enhancedText, setEnhancedText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState('neutral');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHeadTrackingActive, setIsHeadTrackingActive] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toneDialogOpen, setToneDialogOpen] = useState(false);
  const [langDialogOpen, setLangDialogOpen] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  
  // Speech settings
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const {
    speak,
    stop,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    language,
    setLanguage,
    rate,
    setRate,
    pitch,
    setPitch,
  } = useSpeech({ defaultLanguage: 'en' });

  // AI Enhancement hook
  const { enhance, isEnhancing } = useAIEnhance({
    onSuccess: (text) => {
      toast.success('Text enhanced with AI!');
    },
    onError: (error) => {
      console.error('AI enhancement failed:', error);
    }
  });

  const currentSymbols = getSymbolsByCategory(activeCategory);
  const currentLang = getLanguageByCode(language);

  // Add symbol to sentence
  const handleSymbolClick = useCallback((symbol: Symbol) => {
    setSelectedSymbols(prev => [...prev, symbol]);
    setEnhancedText(''); // Clear enhanced text when adding new symbol
    
    if (autoSpeak) {
      speak(symbol.text);
    }
  }, [autoSpeak, speak]);

  // Remove symbol from sentence
  const handleRemoveSymbol = useCallback((index: number) => {
    setSelectedSymbols(prev => prev.filter((_, i) => i !== index));
    setEnhancedText('');
  }, []);

  // Clear all symbols
  const handleClear = useCallback(() => {
    setSelectedSymbols([]);
    setEnhancedText('');
    stop();
  }, [stop]);

  // Speak the sentence - uses the enhanced/translated text and correct language voice
  const handleSpeak = useCallback(() => {
    const text = enhancedText || selectedSymbols.map(s => s.text).join(' ');
    if (text) {
      speak(text);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: generateId(),
        text,
        timestamp: new Date(),
        language,
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 items
    }
  }, [enhancedText, selectedSymbols, speak, language]);

  // AI-powered enhancement with tone and translation
  const handleEnhance = useCallback(async () => {
    const rawText = selectedSymbols.map(s => s.text).join(' ');
    if (!rawText.trim()) {
      toast.error('Please select some symbols first');
      return;
    }
    
    const result = await enhance(rawText, selectedTone, language, 'en');
    if (result) {
      setEnhancedText(result);
    }
  }, [selectedSymbols, selectedTone, language, enhance]);

  // Handle tone change - apply enhancement immediately
  const handleToneChange = useCallback(async (tone: string) => {
    setSelectedTone(tone);
    setToneDialogOpen(false);
    
    // Auto-enhance when tone changes if there are symbols
    if (selectedSymbols.length > 0) {
      const rawText = selectedSymbols.map(s => s.text).join(' ');
      const result = await enhance(rawText, tone, language, 'en');
      if (result) {
        setEnhancedText(result);
      }
    }
  }, [selectedSymbols, language, enhance]);

  // Handle language change - apply translation immediately
  const handleLanguageChange = useCallback(async (code: string) => {
    setLanguage(code);
    setLangDialogOpen(false);
    
    // Auto-translate when language changes if there are symbols
    if (selectedSymbols.length > 0) {
      const rawText = selectedSymbols.map(s => s.text).join(' ');
      const result = await enhance(rawText, selectedTone, code, 'en');
      if (result) {
        setEnhancedText(result);
      }
    }
  }, [selectedSymbols, selectedTone, setLanguage, enhance]);

  // Clear history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Speak history item
  const handleSpeakHistoryItem = useCallback((text: string) => {
    speak(text);
  }, [speak]);

  // Select history item
  const handleSelectHistoryItem = useCallback((text: string) => {
    setEnhancedText(text);
    setIsHistoryOpen(false);
  }, []);

  // Test a voice without selecting it
  const handleTestVoice = useCallback((voice: SpeechSynthesisVoice) => {
    const testText = "Hello, this is how I sound.";
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [rate, pitch]);

  return (
    <div className={`min-h-screen bg-background ${largeText ? 'text-lg' : ''} ${highContrast ? 'contrast-125' : ''}`}>
      <Header
        onSettingsClick={() => setIsSettingsOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onHeadTrackingClick={() => setIsHeadTrackingActive(!isHeadTrackingActive)}
        isHeadTrackingActive={isHeadTrackingActive}
        onVoiceClick={() => setVoiceDialogOpen(true)}
        currentVoice={selectedVoice?.name?.replace(/Microsoft |Google |Apple /, '').slice(0, 15) || 'Voice'}
      />

      <main className="max-w-7xl mx-auto px-3 py-4 space-y-4">
        {/* Sentence Builder with integrated action bar */}
        <SentenceBuilder
          selectedSymbols={selectedSymbols}
          onClear={handleClear}
          onRemoveSymbol={handleRemoveSymbol}
          onSpeak={handleSpeak}
          onEnhance={handleEnhance}
          isSpeaking={isSpeaking}
          isEnhancing={isEnhancing}
          enhancedText={enhancedText}
          selectedTone={selectedTone}
          onToneClick={() => setToneDialogOpen(true)}
          selectedLanguage={language}
          onLanguageClick={() => setLangDialogOpen(true)}
          languageFlag={currentLang?.flag || '🌐'}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Symbol Grid */}
        <SymbolGrid
          symbols={currentSymbols}
          onSymbolClick={handleSymbolClick}
          selectedSymbols={selectedSymbols}
        />
      </main>

      {/* Tone Selection Dialog */}
      <Dialog open={toneDialogOpen} onOpenChange={setToneDialogOpen}>
        <DialogContent className="sm:max-w-[320px] p-4">
          <DialogTitle className="sr-only">Select Tone</DialogTitle>
          <ToneSelector
            selectedTone={selectedTone}
            onToneChange={handleToneChange}
          />
        </DialogContent>
      </Dialog>

      {/* Language Selection Dialog */}
      <Dialog open={langDialogOpen} onOpenChange={setLangDialogOpen}>
        <DialogContent className="sm:max-w-[340px] p-4">
          <DialogTitle className="sr-only">Select Language</DialogTitle>
          <LanguageSelector
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </DialogContent>
      </Dialog>

      {/* Voice Selection Dialog */}
      <Dialog open={voiceDialogOpen} onOpenChange={setVoiceDialogOpen}>
        <DialogContent className="sm:max-w-[380px] p-4">
          <DialogTitle className="sr-only">Select Voice</DialogTitle>
          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={(voice) => {
              setSelectedVoice(voice);
              setVoiceDialogOpen(false);
            }}
            onTestVoice={handleTestVoice}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        speechRate={rate}
        onSpeechRateChange={setRate}
        speechPitch={pitch}
        onSpeechPitchChange={setPitch}
        autoSpeak={autoSpeak}
        onAutoSpeakChange={setAutoSpeak}
        highContrast={highContrast}
        onHighContrastChange={setHighContrast}
        largeText={largeText}
        onLargeTextChange={setLargeText}
      />

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSpeakItem={handleSpeakHistoryItem}
        onSelectItem={handleSelectHistoryItem}
      />

      {/* Head Tracking Overlay */}
      {isHeadTrackingActive && (
        <HeadTrackingOverlay onClose={() => setIsHeadTrackingActive(false)} />
      )}
    </div>
  );
}
