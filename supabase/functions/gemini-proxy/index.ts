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
    const { latestMessage, conversationHistory, model = 'gemini-3-flash' } = await req.json();

    const API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY (or LOVABLE_API_KEY) is not configured");
    }

    // Build user-facing prompt and require JSON output
    const historyText = (conversationHistory || [])
      .slice(-15)
      .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
      .join(`\n`);

    const systemPrompt = `You are a helpful, concise assistant. Answer naturally.\nRespond in JSON only with keys: {"reply": string, "action": string|null, "confidence": number (0-1), "sources": string[] }.`;

    const userPrompt = `Conversation:\n${historyText || 'No history'}\n\nLatest message: "${latestMessage}"\n\nProvide the JSON object now.`;

    const body = {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_output_tokens: 512,
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error('Gemini proxy error', resp.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const generated = data.choices?.[0]?.message?.content || '';

    // Try to extract JSON object from model output
    try {
      const match = (generated as string).match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } catch (err) {
      console.warn('gemini-proxy: failed to parse JSON from model output', err);
    }

    // Fallback: return plain text wrapped
    return new Response(JSON.stringify({ reply: String(generated).trim(), action: null, confidence: 0.6, sources: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error('gemini-proxy error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
