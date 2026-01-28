export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voiceLang: string; // BCP 47 language tag for Speech Synthesis
}

export const languages: Language[] = [
  // Major world languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', voiceLang: 'en-US' },
  { code: 'en-gb', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧', voiceLang: 'en-GB' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', voiceLang: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', voiceLang: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', voiceLang: 'de-DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', voiceLang: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', voiceLang: 'pt-PT' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português', flag: '🇧🇷', voiceLang: 'pt-BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', voiceLang: 'ru-RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', voiceLang: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', voiceLang: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', voiceLang: 'ko-KR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', voiceLang: 'ar-SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voiceLang: 'hi-IN' },
  
  // African languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', voiceLang: 'sw-KE' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', voiceLang: 'zu-ZA' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', voiceLang: 'af-ZA' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', voiceLang: 'am-ET' },
  
  // Nigerian languages
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', voiceLang: 'yo-NG' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', voiceLang: 'ha-NG' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', voiceLang: 'ig-NG' },
  { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naijá', flag: '🇳🇬', voiceLang: 'pcm-NG' },
  
  // Other languages
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', voiceLang: 'tr-TR' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', voiceLang: 'pl-PL' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', voiceLang: 'nl-NL' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', voiceLang: 'el-GR' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', voiceLang: 'he-IL' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', voiceLang: 'th-TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', voiceLang: 'vi-VN' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', voiceLang: 'id-ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', voiceLang: 'ms-MY' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', voiceLang: 'fil-PH' },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const getNigerianLanguages = (): Language[] => {
  return languages.filter(lang => ['yo', 'ha', 'ig', 'pcm'].includes(lang.code));
};

export const getAfricanLanguages = (): Language[] => {
  return languages.filter(lang => ['sw', 'zu', 'af', 'am', 'yo', 'ha', 'ig', 'pcm'].includes(lang.code));
};
