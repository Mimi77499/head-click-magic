import { useState, useCallback, useEffect, useRef } from 'react';
import { Language, getLanguageByCode } from '@/data/languagesData';

interface UseSpeechOptions {
  defaultLanguage?: string;
  defaultRate?: number;
  defaultPitch?: number;
}

interface UseSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  language: string;
  setLanguage: (code: string) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  getVoicesForLanguage: (langCode: string) => SpeechSynthesisVoice[];
  isSupported: boolean;
}

export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const {
    defaultLanguage = 'en',
    defaultRate = 0.9,
    defaultPitch = 1.0,
  } = options;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [language, setLanguageState] = useState(defaultLanguage);
  const [rate, setRate] = useState(defaultRate);
  const [pitch, setPitch] = useState(defaultPitch);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Auto-select best voice for current language
      if (availableVoices.length > 0 && !selectedVoice) {
        const langData = getLanguageByCode(language);
        const voiceLang = langData?.voiceLang || 'en-US';
        
        // Try to find a voice for the exact language
        let bestVoice = availableVoices.find(v => 
          v.lang.toLowerCase().startsWith(voiceLang.toLowerCase().split('-')[0])
        );
        
        // Fallback to English if no match
        if (!bestVoice) {
          bestVoice = availableVoices.find(v => v.lang.startsWith('en'));
        }
        
        if (bestVoice) {
          setSelectedVoice(bestVoice);
        }
      }
    };

    // Load voices immediately
    loadVoices();

    // Also load when voices change (async loading in some browsers)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported, language, selectedVoice]);

  // Get voices for a specific language
  const getVoicesForLanguage = useCallback((langCode: string): SpeechSynthesisVoice[] => {
    const langData = getLanguageByCode(langCode);
    const voiceLang = langData?.voiceLang || langCode;
    const langPrefix = voiceLang.split('-')[0].toLowerCase();

    return voices.filter(voice => 
      voice.lang.toLowerCase().startsWith(langPrefix)
    );
  }, [voices]);

  // Update voice when language changes
  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    
    const langData = getLanguageByCode(code);
    const voiceLang = langData?.voiceLang || code;
    const langPrefix = voiceLang.split('-')[0].toLowerCase();
    
    // Find best voice for new language
    const matchingVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith(langPrefix)
    );
    
    if (matchingVoices.length > 0) {
      // Prefer Google or Microsoft voices for better quality
      const preferredVoice = matchingVoices.find(v => 
        v.name.includes('Google') || v.name.includes('Microsoft')
      ) || matchingVoices[0];
      
      setSelectedVoice(preferredVoice);
    }
  }, [voices]);

  // Speak text
  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      const langData = getLanguageByCode(language);
      utterance.lang = langData?.voiceLang || 'en-US';
    }

    // Set speech parameters
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    // Speak
    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, language, rate, pitch]);

  // Stop speaking
  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return {
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
    getVoicesForLanguage,
    isSupported,
  };
}
