import os
import time
import streamlit as st

# Try to import Google Generative AI client if available
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False

# Configure model
DEFAULT_MODEL = "gemini-1.5-flash"

st.set_page_config(page_title="SayIt — Gemini Chat Prototype", layout="wide")

st.title("SayIt — Gemini Chat Prototype")
st.markdown("Small prototype that demonstrates a Gemini-backed chat using Streamlit.")

# API key resolution: prefer Streamlit secrets then env var
API_KEY = None
if "GEMINI_API_KEY" in st.secrets:
    API_KEY = st.secrets["GEMINI_API_KEY"]
elif os.environ.get("GEMINI_API_KEY"):
    API_KEY = os.environ.get("GEMINI_API_KEY")

if GENAI_AVAILABLE and API_KEY:
    try:
        genai.configure(api_key=API_KEY)
    except Exception:
        pass

if "history" not in st.session_state:
    st.session_state.history = []  # each item: {role: 'user'|'assistant', 'content': str}

# System prompt to guide Gemini (keeps responses concise and helpful)
SYSTEM_PROMPT = (
    "You are an expert, friendly assistant. Answer clearly and concisely. "
    "When a question is factual, give a brief answer and offer to provide sources. "
    "When you are unsure, say you are unsure and offer to look up the information."
)

# Render chat history
for msg in st.session_state.history:
    if msg["role"] == "user":
        st.chat_message("user").write(msg["content"])
    else:
        st.chat_message("assistant").write(msg["content"])

# Input box
user_input = st.chat_input("Type your question...")

# Helper to call Gemini (best-effort; requires google-generativeai package and API key)
def call_gemini(prompt: str, model: str = DEFAULT_MODEL) -> str:
    # If the official client is not installed or no API key, return a helpful hint
    if not GENAI_AVAILABLE or not API_KEY:
        return (
            "Gemini client not configured.\n"
            "Install the `google-generativeai` package and set the environment variable\n"
            "GEMINI_API_KEY or add it to Streamlit secrets as GEMINI_API_KEY."
        )

    # Build the full prompt with system instructions and recent history
    # We keep this simple: concatenated conversation turns
    history_text = "\n".join(
        [f"User: {m['content']}" if m['role'] == 'user' else f"Assistant: {m['content']}" for m in st.session_state.history[-12:]]
    )
    full_prompt = f"{SYSTEM_PROMPT}\n\nConversation:\n{history_text}\nUser: {prompt}\nAssistant:"

    try:
        # Best-effort: use genai.generate_text if available
        # The exact client API may vary; this attempts to use the common genai.generate_text API.
        response = genai.generate_text(model=model, prompt=full_prompt, max_output_tokens=512)
        # Many client versions expose `.text` on the response
        text = getattr(response, "text", None) or str(response)
        return text.strip()
    except Exception as e:
        return f"Error calling Gemini: {e}"


# When user submits
if user_input:
    # Append user message
    st.session_state.history.append({"role": "user", "content": user_input})

    # Show the user message immediately
    st.chat_message("user").write(user_input)

    # Placeholder for the assistant streaming answer
    assistant_placeholder = st.empty()
    assistant_text = ""

    # Get the model response (we fetch full response then stream locally)
    reply = call_gemini(user_input)

    # Stream the reply into the UI in small chunks to simulate streaming
    # (If the client supports streaming, replace this with real streaming logic.)
    chunk_size = 40
    for i in range(0, len(reply), chunk_size):
        assistant_text += reply[i:i+chunk_size]
        assistant_placeholder.chat_message("assistant").write(assistant_text)
        time.sleep(0.03)

    # Save final assistant message in history
    st.session_state.history.append({"role": "assistant", "content": reply})

    # Offer a quick action row
    with st.expander("Assistant metadata"):
        st.write(f"Model used: {DEFAULT_MODEL}")
        if API_KEY:
            st.write("API: configured")
        else:
            st.write("API: not configured")

    # Scroll to bottom by re-rendering (Streamlit handles this automatically in many cases)
    st.experimental_rerun()
