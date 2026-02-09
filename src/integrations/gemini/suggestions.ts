import { geminiModel } from './client';
import { Symbol } from '@/data/symbolsData';
import { StructuredReply } from './types';

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
  if (!geminiModel) {
    console.warn('getSuggestedPhrases: Gemini client-side model not available');
    return [];
  }
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
  if (!geminiModel) {
    console.warn('enhanceTextWithContext: Gemini client-side model not available');
    return text;
  }
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
  if (!geminiModel) {
    console.warn('analyzeSentiment: Gemini client-side model not available');
    return { sentiment: 'neutral', confidence: 0 };
  }
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

import { StructuredReply } from './types';

export async function generateReply(
  latestMessage: string,
  conversationHistory: Array<{ role: 'user' | 'other'; text: string }> = []
): Promise<StructuredReply> {
  try {
    const historyContext = conversationHistory
      .map(h => `${h.role === 'user' ? 'Me' : 'Them'}: ${h.text}`)
      .slice(-15)  // Include last 15 messages for richer context
      .join('\n');
    // ChatGPT-like system prompt: helpful, knowledgeable, conversational across all topics.
    const systemInstructions = `You are a friendly, knowledgeable, and helpful conversation partner. You can answer questions on almost any topic, explain concepts, provide advice, and have natural conversations. \n- Tone: warm, clear, plain language, culturally neutral.\n- Length: 1-3 sentences for normal replies; longer for explanations or when the user needs detail.\n- Be proactive: if the user asks a question, give a full, useful answer. If unclear, ask clarifying questions.\n- Never give generic acknowledgements alone ("Thanks", "Got it") — always provide substantive responses.\n- Cover topics: general knowledge, learning, advice, explanations, conversations, problem-solving, creative ideas, etc.\n- If you don't know something, say so and suggest how the user might find out.\n- Output MUST be valid JSON: {"reply": string, "action": string|null, "confidence": number (0-1), "sources": string[] }.\nDo not include any text outside the JSON object.`;

    // Few-shot examples showing ChatGPT-like behavior across topics
    const examples = `
Example 1 (General Q&A)
Conversation:
Me: What causes rain?
Them: I can explain that!
Latest message: "Tell me how it works"
Output:
{"reply":"Water from oceans and lakes evaporates into the air, cools as it rises, and condenses into clouds. When the water droplets get heavy enough, they fall as rain.","action":null,"confidence":0.95,"sources":[]}

Example 2 (Learning / Explanation)
Conversation:
Me: I want to learn to cook
Them: That's great!
Latest message: "Where do I start?"
Output:
{"reply":"Start with simple recipes — scrambled eggs, pasta, or stir-fry. Watch a few cooking videos, then practice. The key is learning knife skills, heat control, and timing. Pick a cuisine you love!","action":null,"confidence":0.9,"sources":[]}

Example 3 (Advice)
Conversation:
Me: I'm nervous about my job interview
Them: I understand
Latest message: "Any tips?"
Output:
{"reply":"Research the company beforehand, practice common questions, arrive early, make eye contact, and be yourself. They want to hire someone who fits their culture, not a robot. You've got this!","action":null,"confidence":0.85,"sources":[]}

Example 4 (Clarifying)
Conversation:
Me: Tell me about the president
Them: Which president?
Latest message: "Obama"
Output:
{"reply":"Barack Obama was the 44th US President (2009-2017). He was the first African American president, known for the Affordable Care Act and handling the financial crisis. Would you like to know more?","action":null,"confidence":0.9,"sources":[]}

Example 5 (Uncertain / Low confidence)
Conversation:
Me: What's the capital of Burkina Faso?
Them: Let me think...
Latest message: "Do you know?"
Output:
{"reply":"I believe it's Ouagadougou, but I'm not 100% certain. Would you like me to help you find that information?","action":"askClarifying","confidence":0.6,"sources":[]}
`;

    // Build request to serverless proxy (keeps API key server-side)
    const proxyUrl = (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_GEMINI_PROXY_URL) || 
      'https://yhxdejobqwhfzeviqnht.supabase.co/functions/v1/gemini-proxy';

    try {
      const proxyResp = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latestMessage, conversationHistory, model: 'gemini-3-flash' }),
      });

      if (proxyResp.ok) {
        const parsed = await proxyResp.json();
        if (parsed && typeof parsed.reply === 'string') {
          return {
            reply: parsed.reply,
            action: parsed.action ?? null,
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.6,
            sources: Array.isArray(parsed.sources) ? parsed.sources : []
          } as StructuredReply;
        }
      }
    } catch (err) {
      console.warn('generateReply proxy failed, falling back to client-side model:', err);
    }

    // Fallback: use client-side geminiModel (for local testing when proxy is unavailable)
    if (!geminiModel) {
      console.warn('generateReply: Gemini client-side model not available (missing API key)');
      return { reply: 'Could you clarify that a bit more?', action: 'askClarifying', confidence: 0.5, sources: [] } as StructuredReply;
    }

    console.log('Using client-side Gemini fallback (proxy unavailable)');
    const fallbackPrompt = `${systemInstructions}\n\n${examples}\n\nConversation:\n${historyContext || 'No history'}\n\nLatest message: "${latestMessage}"\n\nProvide the JSON output now.`;
    
    try {
      const result = await geminiModel.generateContent(fallbackPrompt);
      const text = result.response.text().trim();

      // Try to extract JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && typeof parsed.reply === 'string') {
            return {
              reply: parsed.reply,
              action: parsed.action ?? null,
              confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.6,
              sources: Array.isArray(parsed.sources) ? parsed.sources : []
            } as StructuredReply;
          }
        }
      } catch (parseErr) {
        console.warn('Could not parse JSON from fallback response');
      }

      // Return plain text if no JSON found
      if (text && !/^(thanks|got it|ok|okay)[.!]*$/i.test(text)) {
        return { reply: text, action: null, confidence: 0.6, sources: [] } as StructuredReply;
      }
    } catch (fallbackErr) {
      console.error('Fallback Gemini call failed:', fallbackErr);
    }

    return { reply: 'Could you clarify that a bit more?', action: 'askClarifying', confidence: 0.5, sources: [] } as StructuredReply;

  } catch (error) {
    console.error('Error generating reply:', error);
    return {
      reply: 'Sorry, something went wrong. Could you try again?',
      action: null,
      confidence: 0,
      sources: []
    } as StructuredReply;
  }
}
