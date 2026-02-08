import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

export interface Template {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  steps: string[];
  commonPhrases: string[];
  commonResponses: string[];
}

export const templates: Template[] = [
  {
    id: 'market',
    name: 'Market Negotiation',
    emoji: '🐟',
    description: 'Buy/sell items at market or street vendor',
    color: 'from-orange-500 to-red-500',
    steps: [
      'Greet the seller',
      'Ask the price',
      'Make counter offer',
      'Negotiate',
      'Agree on price',
      'Confirm payment method'
    ],
    commonPhrases: [
      'How much is this?',
      'That\'s too expensive',
      'Can you give me a discount?',
      'What\'s the best price?',
      'I\'ll take it!',
      'Thank you, see you next time'
    ],
    commonResponses: [
      'It\'s $5 each',
      'I can give you 10% off',
      'That\'s the lowest price',
      'Fresh today',
      'How many do you want?'
    ]
  },
  {
    id: 'restaurant',
    emoji: '🍽️',
    name: 'Restaurant Ordering',
    description: 'Order food, ask about ingredients, pay bill',
    color: 'from-red-500 to-pink-500',
    steps: [
      'Greet the waiter',
      'Ask about menu',
      'Select your meal',
      'Ask about allergies/options',
      'Confirm order',
      'Ask for bill'
    ],
    commonPhrases: [
      'What do you recommend?',
      'I\'ll have the...',
      'Does this have nuts?',
      'Can I get it without...?',
      'More water please',
      'The bill please',
      'Thank you, it was delicious'
    ],
    commonResponses: [
      'Our special today is...',
      'That comes with...',
      'It\'s prepared with...',
      'Would you like a drink?',
      'Anything else?',
      'That will be $...'
    ]
  },
  {
    id: 'doctor',
    emoji: '🏥',
    name: 'Doctor Appointment',
    description: 'Communicate symptoms, answer medical questions',
    color: 'from-blue-500 to-cyan-500',
    steps: [
      'Check in',
      'Describe symptoms',
      'Answer health questions',
      'Listen to doctor\'s advice',
      'Ask about medicine',
      'Schedule next appointment'
    ],
    commonPhrases: [
      'I have a headache',
      'My throat hurts',
      'I\'ve had this for 3 days',
      'Am I contagious?',
      'When can I return to work?',
      'What medicine should I take?'
    ],
    commonResponses: [
      'Let me check your...',
      'You need to...',
      'Take this medicine',
      'Rest for a few days',
      'Come back if it doesn\'t improve',
      'Here\'s your prescription'
    ]
  },
  {
    id: 'school',
    emoji: '📚',
    name: 'School Communication',
    description: 'Ask questions, participate, communicate with teacher',
    color: 'from-purple-500 to-pink-500',
    steps: [
      'Raise your hand',
      'Ask your question',
      'Listen to answer',
      'Ask for clarification',
      'Take notes',
      'Thank the teacher'
    ],
    commonPhrases: [
      'Can you repeat that?',
      'I don\'t understand',
      'Can you explain...?',
      'What\'s homework?',
      'When is the test?',
      'Can I go to the bathroom?'
    ],
    commonResponses: [
      'That\'s a great question',
      'Here\'s the answer...',
      'Let me explain further',
      'Study pages... to...',
      'The test is on...'
    ]
  },
  {
    id: 'customer-service',
    emoji: '📞',
    name: 'Customer Service',
    description: 'Report problems, track orders, get help',
    color: 'from-green-500 to-teal-500',
    steps: [
      'State the problem',
      'Provide order/account number',
      'Answer clarifying questions',
      'Listen to solution',
      'Confirm resolution',
      'Ask for confirmation number'
    ],
    commonPhrases: [
      'My order didn\'t arrive',
      'This item is broken',
      'I want a refund',
      'Where\'s my package?',
      'Can I exchange this?',
      'Thank you for your help'
    ],
    commonResponses: [
      'I\'ll help you with that',
      'Let me check your order',
      'We can send a replacement',
      'You\'ll get a refund',
      'Here\'s your tracking number',
      'Is there anything else?'
    ]
  },
  {
    id: 'directions',
    emoji: '🗺️',
    name: 'Ask for Directions',
    description: 'Ask how to get somewhere, confirm locations',
    color: 'from-yellow-500 to-orange-500',
    steps: [
      'Greet the person',
      'Ask for direction',
      'Confirm the location',
      'Ask about landmarks',
      'Ask about distance/time',
      'Thank them'
    ],
    commonPhrases: [
      'Where is...?',
      'How do I get to...?',
      'Is it far?',
      'Can I walk there?',
      'Which direction?',
      'What bus should I take?'
    ],
    commonResponses: [
      'Go straight',
      'Turn right/left',
      'It\'s near the...',
      'About 10 minutes',
      'Take the #... bus',
      'You can\'t miss it'
    ]
  }
];

interface TemplatesSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesSelector({ onSelectTemplate }: TemplatesSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Choose Your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Scenario</span>
          </h1>
          <p className="text-xl text-gray-700">
            Get started with pre-built conversation templates for common situations
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template, idx) => (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelectTemplate(template)}
              className="
                group relative text-left bg-white rounded-2xl border-2 border-orange-200 
                p-6 hover:border-orange-500 hover:shadow-xl transition-all duration-300
                overflow-hidden
              "
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-5xl mb-4">{template.emoji}</div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                {/* Quick Preview */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Common phrases:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.commonPhrases.slice(0, 3).map((phrase, i) => (
                      <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* CTA Button */}
                <Button className={`
                  w-full bg-gradient-to-r ${template.color} text-white 
                  font-bold group-hover:shadow-lg transition-all duration-300
                `}>
                  Start Conversation →
                </Button>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Alternative: Blank Conversation */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-2 border-gray-400 text-gray-700 font-bold px-8 py-6">
            Or start with blank conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
