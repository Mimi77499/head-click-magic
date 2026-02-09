import { ArrowRight, Volume2, Eye, MessageSquare, Globe, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LandingProps {
  onNavigate?: (mode: 'home' | 'sayit' | 'collaborative' | 'templates' | 'landing') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const [selectedUseCase, setSelectedUseCase] = useState(0);

  const useCases = [
    {
      title: "Deaf Seller",
      icon: "🧑‍💼",
      description: "Communicates with hearing customers at the market",
      story: "Ahmed is a deaf fish seller. Before SayIt, negotiations took 2x longer with written notes. Now he negotiates prices, compares fish quality, and closes deals in real-time conversations.",
      metrics: "⏱️ 2.5x faster negotiations | 💰 +30% daily sales",
      color: "from-orange-500"
    },
    {
      title: "Motor Disability User",
      icon: "🧑‍🦯",
      description: "Uses head tracking for hands-free communication",
      story: "Maria has cerebral palsy and can't use her hands. Head tracking lets her control SayIt with just eye/head movements. She talks to her doctor, teacher, and friends without assistance.",
      metrics: "🎯 100% independent | 🗣️ Full conversations",
      color: "from-blue-500"
    },
    {
      title: "Speech Disability Student",
      icon: "🧑‍🎓",
      description: "Participates in class discussions and social activities",
      story: "James has apraxia of speech. SayIt lets him express complex thoughts with AI-enhanced phrases. His classmates hear his real voice through the app, and he's finally included in class.",
      metrics: "📚 Active participation | 👥 Social inclusion",
      color: "from-purple-500"
    },
    {
      title: "Autism Spectrum (Non-speaking)",
      icon: "🧑",
      description: "Expresses needs and emotions without overwhelm",
      story: "Sofia is non-speaking and often overwhelmed by verbal communication. SayIt's symbol-based system lets her communicate at her own pace with customized symbols that match her interests.",
      metrics: "😌 Reduced anxiety | 💭 Self-expression",
      color: "from-green-500"
    }
  ];

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Real-Time Conversations",
      desc: "Both human beings see messages instantly - like WhatsApp but accessible"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Head Tracking",
      desc: "Control everything with eye/head movements - zero hands needed"
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: "AI-Powered Phrases",
      desc: "Gemini predicts what you want to say next"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "30+ Languages",
      desc: "Translate instantly - communicate across language barriers"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Works for Everyone",
      desc: "Designed for all disabilities - deaf, motor, speech, autism, more"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Scenario Templates",
      desc: "Market, hospital, school, restaurant - get started in seconds"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header Navigation */}
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
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium">Features</a>
            <a href="#usecases" className="text-gray-700 hover:text-orange-600 font-medium">Use Cases</a>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg" onClick={() => onNavigate?.('sayit')}>
              Try Now
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-orange-900">Break Communication</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Barriers
              </span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Real-time conversations for people with disabilities. 
              <br />
              <strong>No hands? No problem.</strong>
              <br />
              Can't speak? We got you. 
              <br />
              Just want to connect? Perfect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg h-14 px-8 hover:shadow-xl" onClick={() => onNavigate?.('sayit')}>
                  Start Free Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-orange-400 text-orange-700 text-lg h-14 px-8" onClick={() => window.scrollTo({ top: document.body.scrollHeight/2, behavior: 'smooth' })}>
                  Watch Demo
                </Button>
            </div>
            <p className="text-sm text-gray-600 mt-6">✓ Free forever • ✓ No login needed to start • ✓ Share instantly with anyone</p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-orange-200 to-pink-200 rounded-3xl overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center text-6xl">
                💬
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-2xl shadow-xl border-2 border-orange-200 max-w-sm">
              <p className="text-sm font-semibold text-gray-800 mb-2">💡 Real Impact</p>
              <p className="text-2xl font-bold text-orange-600">3.5 billion</p>
              <p className="text-xs text-gray-600">people with disabilities worldwide need better communication tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Built for <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Everyone</span>
        </h3>
        <p className="text-center text-gray-700 mb-12 text-lg">See how different people use SayIt to communicate</p>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {useCases.map((useCase, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedUseCase(idx)}
              className={`
                p-4 rounded-2xl transition-all duration-300 border-2 font-bold
                ${selectedUseCase === idx
                  ? `bg-gradient-to-r ${useCase.color} to-red-500 text-white border-transparent shadow-lg`
                  : 'bg-white text-gray-800 border-gray-200 hover:border-orange-400'
                }
              `}
            >
              <div className="text-3xl mb-2">{useCase.icon}</div>
              <div className="text-sm">{useCase.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Use Case Detail */}
        <div className="bg-white rounded-3xl border-2 border-orange-200 p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-3xl font-bold text-gray-900 mb-4">{useCases[selectedUseCase].title}</h4>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{useCases[selectedUseCase].story}</p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                <p className="font-bold text-orange-900">{useCases[selectedUseCase].metrics}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-6xl">{useCases[selectedUseCase].icon}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Powerful <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Features</span>
        </h3>
        <p className="text-center text-gray-700 mb-12 text-lg">Everything you need to communicate freely</p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-orange-200 p-6 hover:shadow-lg hover:border-orange-400 transition-all duration-300">
              <div className="text-orange-500 mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Break Down Barriers?
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Start communicating in real-time, right now. No sign-up needed.
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg h-14 px-12 font-bold" onClick={() => onNavigate?.('sayit')}>
            Launch App <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>Built for accessibility. Designed for everyone. 💜</p>
          <p className="mt-2 text-sm">Open source • Privacy first • Works offline</p>
        </div>
      </footer>
    </div>
  );
}
