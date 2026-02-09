import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share2, RotateCcw, Settings, Calculator as CalcIcon, Mic, MicOff, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from './Calculator';
import { generateReply } from '@/integrations/gemini/suggestions';
import { SymbolGrid } from './sayit/SymbolGrid';
import { SuggestionsPanel } from './sayit/SuggestionsPanel';
import { categories, getSymbolsByCategory, Symbol } from '@/data/symbolsData';
import { useSpeech } from '@/hooks/useSpeech';
import { useGeminiSuggestions } from '@/hooks/useGeminiSuggestions';

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: Date;
  isTemplate?: boolean;
  action?: string | null;
  confidence?: number;
}

interface CollaborativeModeProps {
  sessionId?: string;
  isHeadTrackingActive?: boolean;
  initialMessage?: string | null;
  onNavigate?: (mode: 'home' | 'sayit' | 'collaborative' | 'templates' | 'landing') => void;
}

export function CollaborativeMode({ sessionId = '', isHeadTrackingActive = false, initialMessage = null, onNavigate }: CollaborativeModeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [otherUserMessage, setOtherUserMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeCategory, setActiveCategory] = useState('phrases');
  const [selectedSymbols, setSelectedSymbols] = useState<Symbol[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Speech & suggestions
  const { speak, isSpeaking } = useSpeech({ defaultLanguage: 'en' });
  const { suggestions, isLoading: isSuggestionsLoading, generateSuggestions } = useGeminiSuggestions();

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setCurrentMessage(prev => prev ? prev + ' ' + transcript : transcript);
          } else {
            interimTranscript += transcript;
          }
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

  // Handle voice input toggle
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Handle symbol selection
  const handleSymbolSelect = useCallback((symbol: Symbol) => {
    setSelectedSymbols(prev => [...prev, symbol]);
    setCurrentMessage(prev => prev ? prev + ' ' + symbol.text : symbol.text);
    // Generate AI suggestions based on selected symbols
    generateSuggestions([symbol], []);
    toast.success(`Added "${symbol.text}"`);
  }, [generateSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setCurrentMessage(suggestion);
    setSelectedSymbols([]);
    toast.success('Suggestion added!');
  }, []);
  const handleSimulateOtherMessage = useCallback(async (msg: string) => {
    // Use Gemini to generate a realistic, structured reply when possible
    try {
      const structured = await generateReply(msg, messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'other', text: m.text })));
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'other',
        text: structured.reply || msg,
        timestamp: new Date(),
        action: structured.action ?? null,
        confidence: structured.confidence ?? undefined,
      };
      setMessages(prev => [...prev, newMessage]);
      setOtherUserMessage('');
    } catch (err) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'other',
        text: 'Thanks for that! ' + msg,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [messages]);

  // Handle calculator value insertion
  const handleCalculatorInsert = useCallback((value: string) => {
    setCurrentMessage(prev => prev ? prev + ' ' + value : value);
    setShowCalculator(false);
  }, []);

  // Send user's message
  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    const userText = currentMessage;
    setCurrentMessage('');

    // Simulate a response to the user's actual message
    setTimeout(() => {
      handleSimulateOtherMessage(userText);
    }, 1000);
  }, [currentMessage, handleSimulateOtherMessage]);

  const copySessionLink = () => {
    const link = `${window.location.origin}?join=${sessionId}`;
    navigator.clipboard.writeText(link);
    toast.success('Session link copied!');
  };

  const quickResponses = [
    { label: 'How much?', emoji: '💰' },
    { label: 'That\'s good', emoji: '👍' },
    { label: 'Too expensive', emoji: '❌' },
    { label: 'Deal!', emoji: '🤝' },
    { label: 'Thank you', emoji: '🙏' },
    { label: 'Can you show me?', emoji: '👀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-t-3xl p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate?.('home')} className="p-2 bg-white/20 rounded-lg">Back</button>
            <div>
              <h1 className="text-2xl font-bold">💬 Conversation</h1>
              <p className="text-sm text-white/80">{messages.length} messages</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={copySessionLink}
              title="Copy session link"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white border-2 border-t-0 border-orange-200 rounded-b-3xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 font-semibold">Start a conversation</p>
                <p className="text-sm text-gray-500 mt-2">Use symbols below or type directly</p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-xs rounded-2xl px-4 py-3 shadow-md
                      ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }
                    `}
                  >
                    <p className="font-medium">{msg.text}</p>
                    {msg.action && (
                      <p className="text-xs mt-1 text-indigo-600">Action: {msg.action}</p>
                    )}
                    {typeof msg.confidence === 'number' && (
                      <p className="text-xs mt-1 text-gray-500">Confidence: {(msg.confidence * 100).toFixed(0)}%</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-600'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Response Buttons */}
        {isHeadTrackingActive && (
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">🎯 Quick Responses (Head Tracking Accessible)</p>
            <div className="grid grid-cols-3 gap-2">
              {quickResponses.map((response) => (
                <button
                  key={response.label}
                  onClick={() => {
                    setCurrentMessage(response.label);
                    handleSendMessage();
                  }}
                  className="
                    p-3 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 
                    hover:from-orange-200 hover:to-red-200
                    border-2 border-orange-300 hover:border-orange-500
                    transition-all duration-300
                    font-semibold text-sm
                  "
                  title={`Say "${response.label}" (Head tracking compatible)`}
                >
                  <div className="text-lg">{response.emoji}</div>
                  <div className="text-xs mt-1">{response.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Symbol Grid for Easy Communication */}
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 mb-6">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mb-2">💡 Click symbols to add them to your message</p>
          <SymbolGrid
            symbols={getSymbolsByCategory(activeCategory)}
            selectedSymbols={selectedSymbols}
            onSymbolClick={handleSymbolSelect}
          />
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <SuggestionsPanel
              suggestions={suggestions}
              isLoading={isSuggestionsLoading}
              onInsertSuggestion={(text) => handleSuggestionClick(text)}
              onStartChatSuggestion={(text) => {
                // send immediately as a message
                setCurrentMessage(text);
                handleSendMessage();
              }}
            />
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-4">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type, speak, or select symbols above..."
              className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-primary focus:outline-none"
            />
            <Button
              onClick={toggleVoiceInput}
              className={`${
                isListening
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white font-bold px-4 rounded-xl transition-all`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <Mic className="w-5 h-5 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded-xl"
              title="Open calculator"
            >
              <CalcIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 rounded-xl hover:shadow-lg"
            >
              Send
            </Button>
          </div>

          {/* Accessibility Indicator */}
          {isHeadTrackingActive && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Head tracking active - Use eye gaze to navigate</span>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white border-2 border-orange-200 rounded-2xl p-4"
          >
            <h3 className="font-bold text-gray-900 mb-4">Accessibility Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={isHeadTrackingActive} className="w-4 h-4" />
                <span className="text-gray-700">Enable Head Tracking</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">High Contrast Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Larger Text</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Auto-speak responses</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Calculator Component */}
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Calculator onInsert={handleCalculatorInsert} onClose={() => setShowCalculator(false)} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
