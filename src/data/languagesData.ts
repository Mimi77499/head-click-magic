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
  { code: 'en-au', name: 'English (Australia)', nativeName: 'English', flag: '🇦🇺', voiceLang: 'en-AU' },
  { code: 'en-in', name: 'English (India)', nativeName: 'English', flag: '🇮🇳', voiceLang: 'en-IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', voiceLang: 'es-ES' },
  { code: 'es-mx', name: 'Spanish (Mexico)', nativeName: 'Español', flag: '🇲🇽', voiceLang: 'es-MX' },
  { code: 'es-ar', name: 'Spanish (Argentina)', nativeName: 'Español', flag: '🇦🇷', voiceLang: 'es-AR' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', voiceLang: 'fr-FR' },
  { code: 'fr-ca', name: 'French (Canada)', nativeName: 'Français', flag: '🇨🇦', voiceLang: 'fr-CA' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', voiceLang: 'de-DE' },
  { code: 'de-at', name: 'German (Austria)', nativeName: 'Deutsch', flag: '🇦🇹', voiceLang: 'de-AT' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', voiceLang: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', voiceLang: 'pt-PT' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português', flag: '🇧🇷', voiceLang: 'pt-BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', voiceLang: 'ru-RU' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳', voiceLang: 'zh-CN' },
  { code: 'zh-tw', name: 'Chinese (Taiwan)', nativeName: '繁體中文', flag: '🇹🇼', voiceLang: 'zh-TW' },
  { code: 'zh-hk', name: 'Chinese (Cantonese)', nativeName: '粵語', flag: '🇭🇰', voiceLang: 'zh-HK' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', voiceLang: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', voiceLang: 'ko-KR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', voiceLang: 'ar-SA' },
  { code: 'ar-eg', name: 'Arabic (Egypt)', nativeName: 'العربية', flag: '🇪🇬', voiceLang: 'ar-EG' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voiceLang: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', voiceLang: 'bn-BD' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', voiceLang: 'ur-PK' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', voiceLang: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', voiceLang: 'te-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', voiceLang: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', voiceLang: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', voiceLang: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', voiceLang: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voiceLang: 'pa-IN' },
  
  // African languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', voiceLang: 'sw-KE' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', voiceLang: 'zu-ZA' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', voiceLang: 'af-ZA' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', voiceLang: 'am-ET' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', voiceLang: 'xh-ZA' },
  
  // Nigerian languages
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', voiceLang: 'yo-NG' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', voiceLang: 'ha-NG' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', voiceLang: 'ig-NG' },
  { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naijá', flag: '🇳🇬', voiceLang: 'pcm-NG' },
  
  // European languages
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', voiceLang: 'tr-TR' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', voiceLang: 'pl-PL' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', voiceLang: 'nl-NL' },
  { code: 'nl-be', name: 'Dutch (Belgium)', nativeName: 'Nederlands', flag: '🇧🇪', voiceLang: 'nl-BE' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', voiceLang: 'el-GR' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', voiceLang: 'he-IL' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', voiceLang: 'cs-CZ' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', voiceLang: 'sk-SK' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', voiceLang: 'hu-HU' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', voiceLang: 'ro-RO' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', voiceLang: 'uk-UA' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', voiceLang: 'sv-SE' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', voiceLang: 'nb-NO' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', voiceLang: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', voiceLang: 'fi-FI' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', voiceLang: 'ca-ES' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', voiceLang: 'hr-HR' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', voiceLang: 'sr-RS' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', voiceLang: 'bg-BG' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', voiceLang: 'lt-LT' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', voiceLang: 'lv-LV' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', voiceLang: 'et-EE' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', voiceLang: 'sl-SI' },
  
  // Asian languages
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', voiceLang: 'th-TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', voiceLang: 'vi-VN' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', voiceLang: 'id-ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', voiceLang: 'ms-MY' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', voiceLang: 'fil-PH' },
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာဘာသာ', flag: '🇲🇲', voiceLang: 'my-MM' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', voiceLang: 'km-KH' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', voiceLang: 'lo-LA' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', voiceLang: 'ne-NP' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', voiceLang: 'si-LK' },
  
  // Other languages
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', voiceLang: 'fa-IR' },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const getNigerianLanguages = (): Language[] => {
  return languages.filter(lang => ['yo', 'ha', 'ig', 'pcm'].includes(lang.code));
};

export const getAfricanLanguages = (): Language[] => {
  return languages.filter(lang => ['sw', 'zu', 'af', 'am', 'xh', 'yo', 'ha', 'ig', 'pcm'].includes(lang.code));
};

export const getIndianLanguages = (): Language[] => {
  return languages.filter(lang => ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'en-in'].includes(lang.code));
};

export const getEuropeanLanguages = (): Language[] => {
  return languages.filter(lang => 
    ['fr', 'de', 'it', 'es', 'pt', 'nl', 'pl', 'tr', 'el', 'he', 'cs', 'sk', 'hu', 'ro', 'uk', 'sv', 'no', 'da', 'fi', 'ca', 'hr', 'sr', 'bg', 'lt', 'lv', 'et', 'sl', 'ru'].includes(lang.code)
  );
};
