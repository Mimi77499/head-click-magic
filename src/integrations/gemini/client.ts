import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
// Use explicit Gemini 3 model to match hackathon requirements
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-3-pro' });
