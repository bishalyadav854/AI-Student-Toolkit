import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing. Check your .env file.")

# Create ONE client and reuse it
gemini_client = genai.Client(api_key=API_KEY)


def ask_text(prompt):
    response = gemini_client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    return response.text


def ask_json(prompt, schema):
    response = gemini_client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": schema,
        },
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    try:
        return json.loads(response.text)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Gemini returned invalid JSON.") from exc