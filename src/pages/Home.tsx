import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, MessageSquare, BookOpen, Sparkles, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onSelectMode: (mode: 'sayit' | 'collaborative' | 'templates' | 'landing' | 'accessible-chat') => void;
}

function HomePage({ onSelectMode }: HomePageProps) {
  const [showMore, setShowMore] = useState(false);

  const modes = [
    {
      id: 'sayit',
      title: 'Quick Message',
      emoji: '🗣️',
      description: 'Use symbols to build & speak your message with AI enhancement',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      accessibility: 'Head tracking • Voice control • Tone selection',
      use: 'When you need to communicate quickly'
    },
    {
      id: 'collaborative',
      title: 'Real Conversation',
      emoji: '💬',
      description: 'Chat with someone in real-time - they don\'t need the app',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      accessibility: 'Head tracking • Quick responses • Message history',
      use: 'When you want to chat with anyone'
    },
    {
      id: 'templates',
      title: 'Guided Templates',
      emoji: '📋',
      description: 'Start with conversation templates for common scenarios',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      accessibility: 'Step-by-step • Suggested phrases • Auto-responses',
      use: 'When you need help structuring a conversation'
    },
    {
      id: 'accessible-chat',
      title: 'Accessible Chat',
      emoji: '♿',
      description: 'Simple, high-contrast chat with head tracking & voice input',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      accessibility: 'High contrast • Large text • Head tracking • Voice input',
      use: 'When you need maximum accessibility & simplicity'
    }
  ];

  const stats = [
    { number: '3.5B', label: 'People with disabilities' },
    { number: '2.5x', label: 'Faster negotiations' },
    { number: '30+', label: 'Languages supported' },
    { number: '0%', label: 'Hands required' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              SayIt
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="border-2 border-orange-400 text-orange-700 font-bold"
            onClick={() => onSelectMode('landing')}
          >
            Learn More
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Break <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Communication Barriers</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Choose how you want to communicate. 
              <br />
              <strong>With symbols, templates, or real-time chat.</strong>
              <br />
              Works with or without your voice. With or without your hands.
            </p>
          </motion.div>
        </section>

        {/* Mode Selection */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {modes.map((mode, idx) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <button
                onClick={() => onSelectMode(mode.id as 'sayit' | 'collaborative' | 'templates' | 'accessible-chat')}
                className="
                  w-full h-full bg-white border-3 border-orange-200 rounded-3xl p-8
                  hover:border-orange-500 hover:shadow-2xl transition-all duration-300
                  text-left overflow-hidden relative
                "
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon Circle */}
                  <div className={`
                    w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} 
                    flex items-center justify-center mb-4 text-white
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {mode.icon}
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{mode.title}</h3>
                    <span className="text-3xl">{mode.emoji}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{mode.description}</p>

                  {/* Accessibility Features */}
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs font-semibold text-orange-900 mb-1">♿ Accessibility:</p>
                    <p className="text-sm text-orange-800">{mode.accessibility}</p>
                  </div>

                  {/* Use Case */}
                  <p className="text-sm text-gray-600 italic">💡 {mode.use}</p>

                  {/* CTA */}
                  <Button className={`
                    w-full mt-6 bg-gradient-to-r ${mode.color} 
                    text-white font-bold group-hover:shadow-lg
                  `}>
                    Start Now →
                  </Button>
                </div>
              </button>
            </motion.div>
          ))}
        </section>

        {/* Impact Stats */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 mb-16 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">Real Impact 💜</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="bg-white border-3 border-orange-200 rounded-3xl p-12 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Why Choose <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">SayIt</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎯', title: 'Built for ALL Disabilities', desc: 'Deaf, motor, speech, autism, and more' },
              { icon: '🧠', title: 'AI-Powered', desc: 'Gemini predicts what you want to say' },
              { icon: '👁️', title: 'Head Tracking', desc: 'Control with just your eyes' },
              { icon: '🌍', title: '30+ Languages', desc: 'Communicate across cultures' },
              { icon: '⚡', title: 'No Setup Needed', desc: 'Start instantly, no account required' },
              { icon: '💬', title: 'Real Conversations', desc: 'Chat with anyone, even non-users' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-700">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Ready to break barriers?</h3>
          <p className="text-gray-700 mb-8">Choose above or</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg h-14 px-12"
            onClick={() => onSelectMode('sayit')}
          >
            Get Started Now
          </Button>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
