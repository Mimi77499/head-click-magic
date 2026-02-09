import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let geminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Use explicit Gemini 3 model to match hackathon requirements
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
} else {
  console.warn('VITE_GEMINI_API_KEY not set—Gemini features will use proxy fallback only');
}

export { geminiModel };
