import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings, Volume2, Eye, ArrowLeft, Send, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReply } from '@/integrations/gemini/suggestions';
import { useSpeech } from '@/hooks/useSpeech';
import { HeadTrackingOverlay } from '@/components/HeadTrackingOverlay';

interface AccessibleChatProps {
  onNavigate?: (mode: 'home' | 'sayit' | 'collaborative' | 'templates' | 'landing' | 'accessible-chat') => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function AccessibleChat({ onNavigate }: AccessibleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHeadTrackingActive, setIsHeadTrackingActive] = useState(false);
  
  // Accessibility settings
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [highContrast, setHighContrast] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const recognitionRef = useRef<any>(null);
  const { speak } = useSpeech({ defaultLanguage: 'en' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          setCurrentInput(prev => (prev + ' ' + transcript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle voice input
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Send message to Gemini
  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Call Gemini via proxy
      const reply = await generateReply(currentInput, messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'other', text: m.text })));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if enabled
      if (autoSpeak) {
        speak(reply.reply);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, messages, autoSpeak, speak]);

  // Quick reply buttons (common phrases)
  const quickReplies = [
    { text: 'Yes', emoji: '👍' },
    { text: 'No', emoji: '👎' },
    { text: 'Help', emoji: '🆘' },
    { text: 'Thank you', emoji: '🙏' },
    { text: 'Sorry', emoji: '😔' },
    { text: 'Good morning', emoji: '🌅' },
    { text: 'How are you?', emoji: '❓' },
    { text: 'I need..', emoji: '🤔' },
    { text: 'Can you help?', emoji: '🤝' },
    { text: 'Where is...?', emoji: '📍' },
    { text: 'What time?', emoji: '⏰' },
    { text: 'Hello', emoji: '👋' },
  ];

  // Calculate text size class
  const textSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-2xl',
  }[textSize];

  const messageSizeClass = {
    normal: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg',
  }[textSize];

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-orange-50 to-yellow-50 text-gray-900'} ${textSizeClass}`}>
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className={`${highContrast ? 'bg-white text-black border-b-4 border-black' : 'bg-gradient-to-r from-primary to-secondary text-white'} p-6 flex items-center justify-between rounded-b-3xl shadow-lg`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                console.log('Back button clicked, navigating to home');
                onNavigate?.('home');
              }}
              className={`p-3 rounded-xl font-bold text-lg transition-all hover:scale-110 ${highContrast ? 'bg-black text-white hover:bg-gray-800 border-2 border-white' : 'bg-white/30 hover:bg-white/50 border-2 border-white'}`}
              title="Back to home"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <div>
              <h1 className="font-bold text-xl">💬 Chat with Gemini</h1>
              <p className="text-sm opacity-75">Type, speak, or use quick replies</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsHeadTrackingActive(!isHeadTrackingActive)}
              className={`p-3 rounded-xl transition-all font-bold ${isHeadTrackingActive ? (highContrast ? 'bg-white text-black' : 'bg-white/30') : (highContrast ? 'bg-gray-700' : 'bg-white/10')}`}
              title={isHeadTrackingActive ? 'Disable head tracking' : 'Enable head tracking'}
              aria-label="Head tracking"
            >
              <Eye className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all ${highContrast ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/10 hover:bg-white/20'}`}
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${highContrast ? 'bg-black' : 'bg-white/40'}`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-6">💬</div>
                <p className={`font-bold mb-3 ${textSizeClass}`}>Start a conversation</p>
                <p className="opacity-75">Type a message, speak, or use quick replies below</p>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl rounded-3xl px-6 py-4 shadow-lg ${
                        msg.sender === 'user'
                          ? highContrast
                            ? 'bg-white text-black'
                            : 'bg-gradient-to-r from-primary to-secondary text-white'
                          : highContrast
                          ? 'bg-gray-800 text-white border-2 border-white'
                          : 'bg-white text-gray-900 border-2 border-orange-200'
                      }`}
                    >
                      <p className={`font-medium ${messageSizeClass} leading-relaxed`}>{msg.text}</p>
                      <p className={`text-xs mt-2 opacity-60 ${textSize !== 'normal' ? 'mt-3' : ''}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </>
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={`${highContrast ? 'bg-gray-800 text-white border-2 border-white' : 'bg-white text-gray-900 border-2 border-orange-200'} rounded-3xl px-6 py-4`}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-current rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick replies grid */}
        {!showSettings && (
          <div className={`${highContrast ? 'bg-gray-900 border-t-4 border-white' : 'bg-white/50 border-t-2 border-orange-200'} p-4`}>
            <p className={`font-semibold mb-3 ${highContrast ? 'text-white' : 'text-gray-800'}`}>Quick replies:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.text}
                  onClick={() => {
                    setCurrentInput(reply.text);
                  }}
                  disabled={isLoading}
                  className={`p-4 rounded-2xl font-bold transition-all ${
                    highContrast
                      ? 'bg-white text-black hover:bg-gray-200 disabled:opacity-50'
                      : 'bg-gradient-to-r from-orange-400 to-red-400 text-white hover:shadow-lg disabled:opacity-50'
                  }`}
                  title={reply.text}
                  aria-label={reply.text}
                >
                  <div className="text-3xl mb-1">{reply.emoji}</div>
                  <div className={`text-xs font-semibold ${textSize === 'normal' ? 'hidden sm:block' : ''}`}>{reply.text}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        {!showSettings && (
          <div className={`${highContrast ? 'bg-gray-900 border-t-4 border-white' : 'bg-gradient-to-t from-orange-100 to-yellow-50 border-t-2 border-orange-300'} p-6 space-y-4`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Type your message... or click a quick reply"
                className={`flex-1 px-6 py-4 rounded-2xl border-3 font-bold focus:outline-none transition-all ${
                  highContrast
                    ? 'bg-white text-black border-white focus:border-yellow-400'
                    : 'bg-white text-gray-900 border-orange-300 focus:border-primary focus:shadow-lg'
                }`}
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`p-4 rounded-2xl font-bold transition-all ${
                  isListening
                    ? highContrast
                      ? 'bg-red-600 text-white'
                      : 'bg-red-500 text-white animate-pulse'
                    : highContrast
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className={`p-4 rounded-2xl font-bold transition-all ${
                  highContrast
                    ? 'bg-white text-black hover:bg-gray-200 disabled:opacity-50'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg disabled:opacity-50'
                }`}
                title="Send message"
                aria-label="Send"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>

            {isHeadTrackingActive && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border-2 ${highContrast ? 'bg-gray-800 border-white text-white' : 'bg-green-50 border-green-500 text-green-800'}`}>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold">Head tracking active — use eye gaze to navigate</span>
              </div>
            )}
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${highContrast ? 'bg-gray-900 border-t-4 border-white' : 'bg-white/80'} p-8 space-y-6 max-h-96 overflow-y-auto`}
          >
            <h2 className={`font-bold text-2xl mb-6`}>Accessibility Settings</h2>

            {/* Text Size */}
            <div className="space-y-3">
              <label className={`font-bold text-lg block`}>Text Size</label>
              <div className="grid grid-cols-3 gap-3">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      textSize === size
                        ? highContrast
                          ? 'bg-white text-black'
                          : 'bg-primary text-white'
                        : highContrast
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'XL'}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <label className={`flex items-center gap-4 cursor-pointer font-bold text-lg`}>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-6 h-6"
                aria-label="High contrast mode"
              />
              High Contrast Mode
            </label>

            {/* Auto-speak */}
            <label className={`flex items-center gap-4 cursor-pointer font-bold text-lg`}>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-6 h-6"
                aria-label="Auto-speak responses"
              />
              Auto-speak AI Responses
            </label>

            <button
              onClick={() => setShowSettings(false)}
              className={`w-full p-4 rounded-2xl font-bold text-lg transition-all ${
                highContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-primary text-white hover:shadow-lg'
              }`}
            >
              Close Settings
            </button>
          </motion.div>
        )}

        {/* Head Tracking Overlay */}
        {isHeadTrackingActive && <HeadTrackingOverlay onClose={() => setIsHeadTrackingActive(false)} />}
      </div>
    </div>
  );
}
