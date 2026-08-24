import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def extract_scam_signals(text: str) -> dict:
    """
    Uses Gemini to extract structured scam-related signals.
    Gemini does NOT make the final scam decision.
    """

    if not text:
        return {}

    prompt = f"""
Analyze the following message for scam-related signals.

Return ONLY valid JSON with these fields:

{{
    "brand": null,
    "intent": null,
    "urgency": false,
    "threat": null,
    "requested_credentials": [],
    "requested_action": null,
    "payment_request": false,
    "payment_method": null,
    "suspicious_entities": []
}}

Do not decide whether the message is a scam.
Only extract what is explicitly or strongly implied by the message.

Message:
{text}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-3.6-flash",
            contents=prompt
        )

        result = response.text.strip()

        # Remove markdown code fences if Gemini adds them
        if result.startswith("```"):
            result = result.replace("```json", "").replace("```", "").strip()

        return json.loads(result)

    except Exception as e:
        print(f"Gemini extraction error: {e}")
        return {}


if __name__ == "__main__":
    test_message = "Your SBI account will be blocked today. Give me your OTP immediately."

    result = extract_scam_signals(test_message)

    print(json.dumps(result, indent=2))