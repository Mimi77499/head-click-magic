import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols, tone, targetLanguage, sourceLanguage } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt based on what's requested
    let systemPrompt = `You are an AAC (Augmentative and Alternative Communication) assistant helping people communicate. Your task is to take a sequence of symbol words/phrases and create a natural, fluent sentence.`;

    let userPrompt = `Convert these symbol words into a natural sentence: "${symbols}"`;

    // Add tone instructions
    if (tone && tone !== 'neutral') {
      const toneInstructions: Record<string, string> = {
        friendly: "Make it warm, approachable and friendly. Add appropriate warmth.",
        formal: "Make it professional, polite and formal.",
        urgent: "Make it urgent and emphasize importance. It should convey immediacy.",
        gentle: "Make it soft, caring and gentle. Use kind words.",
        casual: "Make it relaxed and informal, like talking to a friend.",
        excited: "Make it enthusiastic and excited!"
      };
      userPrompt += `\n\nTone: ${toneInstructions[tone] || "Keep it natural."}`;
    }

    // Add translation instructions
    if (targetLanguage && targetLanguage !== sourceLanguage && targetLanguage !== 'en') {
      const languageNames: Record<string, string> = {
        'yo': 'Yoruba',
        'ha': 'Hausa', 
        'ig': 'Igbo',
        'pcm': 'Nigerian Pidgin English',
        'sw': 'Swahili',
        'zu': 'Zulu',
        'af': 'Afrikaans',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'pt': 'Portuguese',
        'pt-br': 'Brazilian Portuguese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'zh': 'Mandarin Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ru': 'Russian',
        'it': 'Italian',
        'nl': 'Dutch',
        'tr': 'Turkish',
        'pl': 'Polish',
        'vi': 'Vietnamese',
        'th': 'Thai',
        'id': 'Indonesian',
        'ms': 'Malay',
        'fil': 'Filipino',
        'bn': 'Bengali',
        'ta': 'Tamil',
        'te': 'Telugu',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'ur': 'Urdu',
      };
      
      const langName = languageNames[targetLanguage] || targetLanguage;
      userPrompt += `\n\nIMPORTANT: Translate the final sentence to ${langName}. Return ONLY the ${langName} translation.`;
    }

    userPrompt += `\n\nReturn ONLY the enhanced sentence, nothing else. No quotes, no explanations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const enhancedText = data.choices?.[0]?.message?.content?.trim() || symbols;

    return new Response(
      JSON.stringify({ enhancedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("enhance-text error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
