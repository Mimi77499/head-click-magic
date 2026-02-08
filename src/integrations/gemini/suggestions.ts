import { geminiModel } from './client';
import { Symbol } from '@/data/symbolsData';

export interface Suggestion {
  text: string;
  confidence: number;
  reason: string;
}

export async function getSuggestedPhrases(
  currentSymbols: Symbol[],
  conversationHistory: Array<{ role: 'user' | 'other'; text: string }>,
  category?: string
): Promise<Suggestion[]> {
  try {
    const currentSentence = currentSymbols.map(s => s.text).join(' ');
    const historyContext = conversationHistory
      .map(h => `${h.role === 'user' ? 'Me' : 'Them'}: ${h.text}`)
      .join('\n');

    const prompt = `You are helping a deaf human being communicate using symbol-based AAC (Augmentative and Alternative Communication).

Current conversation:
${historyContext || 'No history yet'}

Current symbols selected: "${currentSentence || 'None yet'}"

Suggest the top 3-5 most likely next phrases this human being might want to say. These should be:
- Short and natural
- Contextually relevant to the conversation
- Practical for real-world communication
- Using simple, everyday language

Format your response as JSON array with this structure:
[
  { "text": "phrase here", "confidence": 0.95, "reason": "why this phrase" },
  ...
]

Only return valid JSON, no markdown or explanation.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Could not parse suggestions response');
      return [];
    }

    const suggestions: Suggestion[] = JSON.parse(jsonMatch[0]);
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  } catch (error) {
    console.error('Error getting phrase suggestions:', error);
    return [];
  }
}

export async function enhanceTextWithContext(
  text: string,
  tone: string,
  conversationHistory: Array<{ role: 'user' | 'other'; text: string }>
): Promise<string> {
  try {
    const historyContext = conversationHistory
      .map(h => `${h.role === 'user' ? 'Me' : 'Them'}: ${h.text}`)
      .slice(-5) // Last 5 exchanges for context
      .join('\n');

    const prompt = `You are helping improve the natural language in a communication exchange. A deaf human being is using symbol-based communication.

Recent conversation context:
${historyContext || 'No history'}

Current message to enhance: "${text}"
Desired tone: ${tone}

Improve this message to sound more natural while keeping it concise. Make it grammatically correct and conversational for the tone of "${tone}".
Only provide the improved text, nothing else.`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error enhancing text:', error);
    return text; // Return original if enhancement fails
  }
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}> {
  try {
    const prompt = `Analyze the sentiment of this text in one word: "${text}"
Reply with ONLY: positive, negative, or neutral`;

    const result = await geminiModel.generateContent(prompt);
    const sentiment = result.response.text().toLowerCase().trim() as 'positive' | 'negative' | 'neutral';
    
    return {
      sentiment: ['positive', 'negative', 'neutral'].includes(sentiment) ? sentiment : 'neutral',
      confidence: 0.85
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', confidence: 0 };
  }
}
