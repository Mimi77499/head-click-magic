# Gemini 3 Integration: The Heart of SayIt's Intelligence

**How Gemini Powers Accessibility**

SayIt leverages Google's Gemini 3 API as the core intelligence engine, enabling real-time, intelligent conversations for people with disabilities. Here's why Gemini 3 is perfect for our mission:

**1. Multi-Turn Conversation Understanding**
Gemini 3's ability to maintain rich conversation context (we pass 15 previous messages) allows SayIt to understand nuanced, ongoing dialogues. A deaf person negotiating at a market or a stroke patient rebuilding communication can have truly natural exchanges, not robotic one-liners.

**2. Structured Output with Confidence Scoring**
We use Gemini 3's JSON response capability to return structured replies with:
- **Reply text** (what to say)
- **Confidence score** (0-1 scale so UI can flag uncertain answers)
- **Action hints** (e.g., "ask clarifying question")
- **Sources** (for fact-checked responses)

This lets our UI be smart: low-confidence answers trigger clarification flows; high-confidence ones display instantly.

**3. Secure Server-Side Architecture**
Instead of exposing API keys in the browser, we built a Supabase Edge Function proxy. The browser never touches credentials—Gemini calls happen server-side, then structured replies stream back to users.

**4. Few-Shot Prompting for Accessibility**
We trained Gemini 3 with 5+ examples of accessible, compassionate, clear responses. No generic "thanks for that"—every reply is thoughtful and jargon-free.

**Result:** A communication app that's as smart as it is kind.
