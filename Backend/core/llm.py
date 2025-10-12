# backend/core/llm.py
import httpx

# The URL where your local Ollama API is running
OLLAMA_API_URL = "http://localhost:11434/api/generate"

# The specific model you want to use
OLLAMA_MODEL = "casemate"

# --- WE ARE REMOVING THE SYSTEM_PROMPT VARIABLE FROM PYTHON ---
# Your Modelfile will now be the single source of truth for the system prompt.

async def get_ollama_response(user_prompt: str) -> str:
    """
    Sends only the user's prompt to the Ollama API.
    The 'casemate' model's built-in system prompt will be used automatically.
    """
    # The payload is now much simpler
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": user_prompt, # Only send the user's actual question
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status()
            response_data = response.json()
            return response_data.get("response", "Sorry, I couldn't generate a response.").strip()

    except httpx.RequestError as e:
        print(f"Error connecting to Ollama: {e}")
        return "Sorry, I am currently unable to connect to the AI model."
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return "An unexpected error occurred while generating a response."