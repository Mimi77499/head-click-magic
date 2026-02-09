# 🎯 SayIt — Accessible AI-Powered Communication for Everyone

**Breaking communication barriers for people with disabilities using Google Gemini 3 and modern web accessibility.**

---

## 🚀 Overview

**SayIt** is an open-source, AI-powered Augmentative and Alternative Communication (AAC) application designed to help people with speech, motor, and cognitive disabilities communicate naturally, expressively, and independently.

Powered by **Google Gemini 3**, SayIt enables:
- 💬 **Natural, intelligent conversations** via AI-driven replies
- 👁️ **Head-tracking eye-gaze control** (hands-free interaction for people without hands)
- 🎙️ **Voice input & output** (speak to chat, hear AI responses)
- ♿ **High-contrast, large-text UI** (visual accessibility for low-vision users)
- 🌍 **30+ language support** (multilingual communication)
- ✨ **Symbol-based communication** (for non-verbal users)

### Who is SayIt for?

✓ Deaf and hard-of-hearing individuals  
✓ Non-verbal people (autism, apraxia, etc.)  
✓ Motor disabilities (ALS, cerebral palsy, stroke recovery)  
✓ Speech impairments  
✓ Anyone who needs an accessible communication tool  

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Accessible Chat** | Simple, high-contrast chat with Gemini 3 backend. Type, speak, or use quick-reply buttons. |
| **Head-Tracking Control** | Eye-gaze navigation for hands-free interaction (for people without hand use). |
| **Voice Input & Output** | Speak to type, hear AI responses read aloud. |
| **Symbol-Based AAC** | Build messages from symbols for non-verbal communication. |
| **AI Suggestions** | Gemini 3 predicts next phrases based on your symbols and conversation context. |
| **High Contrast Mode** | Black/white UI option for visual accessibility. |
| **Large Text Settings** | Adjustable text sizes (normal, large, XL). |
| **Quick-Reply Buttons** | Pre-set common phrases accessible via head-gaze or touch. |
| **Real-Time Conversation** | Chat mode for talking with hearing individuals (they don't need the app). |

---

## 💡 Gemini 3 Integration

SayIt leverages **Google Gemini 3** to power intelligent, context-aware conversations:

- **Smart Replies**: Gemini 3 generates natural, thoughtful responses based on conversation history
- **Phrase Suggestions**: AI predicts the next phrase you want to say using your symbols and context
- **Multi-turn Conversations**: Understands conversation flow and provides relevant, helpful responses
- **Accessible Language**: Generates clear, concise replies suitable for users of all abilities

See [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md) for detailed integration notes.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend/AI** | Google Generative AI (Gemini 3), Supabase Edge Functions |
| **Accessibility** | Web Speech API, Head-Tracking (Human.js), ARIA labels |
| **Deployment** | Vercel (frontend), Supabase (backend functions) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Google Gemini API key (from [ai.google.dev](https://ai.google.dev))

### Installation

```bash
# Clone the repository
git clone https://github.com/Mimi77499/head-click-magic.git
cd head-click-magic

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Start dev server
npm run dev
```

The app will be available at **http://localhost:8080** (or next available port).

---

## 📦 Project Structure

```
src/
├── pages/
│   ├── AccessibleChat.tsx     # Main accessible chat UI (high-contrast, head-tracking)
│   ├── SayIt.tsx              # Symbol-based AAC mode
│   ├── Home.tsx               # Mode selector dashboard
│   └── Landing.tsx            # Feature overview & usage scenarios
├── components/
│   ├── CollaborativeMode.tsx  # Real-time conversation chat
│   ├── HeadTrackingOverlay.tsx # Eye-gaze UI overlay
│   └── sayit/                 # Symbol grid, suggestions, tone selector, etc.
├── integrations/
│   └── gemini/
│       ├── client.ts          # Gemini 3 client initialization
│       ├── suggestions.ts     # AI suggestion & reply generation
│       └── types.ts           # TypeScript types for structured replies
└── hooks/
    ├── useGeminiSuggestions.ts # Hook for phrase suggestions
    ├── useSpeech.ts           # Text-to-speech & voice control
    └── useHeadTracking.ts     # Head-tracking gesture detection

supabase/functions/gemini-proxy/  # Serverless function to proxy Gemini (keeps API key server-side)
```

---

## 🔐 Security

- **API Key**: Stored server-side in Supabase Edge Functions; never exposed to the browser
- **CORS**: Configured for secure cross-origin requests
- **No User Data**: Conversations are not persisted by default (local storage only)

---

## 🌐 Deployment

### Deploy on Vercel

```bash
# 1. Push your code to GitHub
git push

# 2. Import repository in Vercel dashboard
# (https://vercel.com/import)

# 3. Set environment variables in Vercel:
#    VITE_GEMINI_API_KEY=your_key

# 4. Deploy
```

### Deploy Supabase Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Deploy the gemini-proxy function
supabase functions deploy gemini-proxy --project <your-project-ref>
```

See [DEPLOY_GEMINI_PROXY.md](DEPLOY_GEMINI_PROXY.md) for detailed instructions.

---

## 📖 Usage Guide

### AccessibleChat (Recommended for Maximum Accessibility)
1. Click **"Accessible Chat"** on the home page
2. Type a message, use voice input, or tap a quick-reply button
3. Gemini 3 generates an intelligent response
4. Responses are read aloud (if enabled)
5. Adjust settings (text size, high contrast) as needed

### Symbol-Based Mode (SayIt)
1. Click **"Quick Message"** to build a message from symbols
2. Select words/phrases from symbol categories
3. Tone and language adjustments available
4. AI enhancement can refine your message
5. Speak the final message

### Real Conversation (CollaborativeMode)
1. Click **"Real Conversation"** to chat with someone
2. They don't need the app — works with any messaging platform
3. Full symbol grid + AI suggestions available
4. Voice input supported

---

## ♿ Accessibility Features Checklist

- ✅ Head-tracking eye-gaze control (hands-free)
- ✅ Voice input (Web Speech API)
- ✅ Voice output (Text-to-speech with 100+ voices)
- ✅ High-contrast mode (black/white)
- ✅ Large text options
- ✅ Keyboard navigation
- ✅ ARIA labels & semantic HTML
- ✅ Screen-reader friendly
- ✅ No flashing/animations in critical UI

---

## 🧪 Testing

Run tests:
```bash
npm run test
```

Build for production:
```bash
npm run build
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push and open a Pull Request

---

## 📞 Support & Feedback

- **Report bugs**: [GitHub Issues](https://github.com/Mimi77499/head-click-magic/issues)
- **Suggest features**: Open a discussion or issue
- **Email**: [contact info if available]

---

## 🎓 Resources

- [Google Gemini 3 Documentation](https://ai.google.dev/docs)
- [Web Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Augmentative and Alternative Communication](https://www.asha.org/public/hearing/aac/)

---

## 🙏 Acknowledgments

Built for accessibility. Designed for everyone. Made with ❤️ for people with disabilities.

**SayIt is a Gemini 3 hackathon submission.**


Saved user profiles (voice, language, tone)

Offline mode

Expanded gesture customization

Caregiver / assistant mode

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a feature branch

Commit your changes

Open a pull request

📄 License

This project is open-source and available under the MIT License.


