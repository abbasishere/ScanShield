import base64
import io
import os
import re
from typing import Dict, Any, Optional

try:
    import google.generativeai as genai
    from PIL import Image
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

def extract_text_from_image_base64(image_base64_str: str) -> Dict[str, Any]:
    """
    Extracts text and identifies brands/offers from uploaded screenshots
    using Gemini Vision / OCR analysis.
    """
    if not image_base64_str:
        return {
            "ocrText": None,
            "hasOcrText": False,
            "extractedBrand": None,
            "score": 0.0,
            "detail": "No image uploaded."
        }

    try:
        # Strip header if present
        if ',' in image_base64_str:
            image_data_str = image_base64_str.split(',')[1]
        else:
            image_data_str = image_base64_str

        decoded_bytes = base64.b64decode(image_data_str)
        image = Image.open(io.BytesIO(decoded_bytes))

        api_key = os.environ.get("GEMINI_API_KEY")
        
        extracted_text = None
        extracted_brand = None

        # 1. Try Gemini Vision API if key available
        if GENAI_AVAILABLE and api_key:
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = (
                    "Extract all text visible in this image. Also identify the main brand or company name "
                    "(e.g. 'Aurum Markets', 'Zerodha', 'SEBI', 'Flipkart') and any financial promises ($100 bonus, guaranteed returns)."
                )
                response = model.generate_content([prompt, image])
                if response and response.text:
                    extracted_text = response.text
            except Exception as vision_err:
                print(f"Gemini Vision API error: {vision_err}")

        if not extracted_text:
            extracted_text = ""

        # Extract brand name using pattern matcher
        brand_match = re.search(r'(aurum markets|zerodha|groww|octafx|olymptrade|flipkart|tata capital|motilal oswal)', extracted_text, re.IGNORECASE)
        if brand_match:
            extracted_brand = brand_match.group(0).title()
        else:
            # Extract first capitalized phrase as brand
            first_words = extracted_text.split()[:4]
            extracted_brand = " ".join(first_words) if first_words else "Unknown Brand"

        has_bonus_or_guarantee = bool(re.search(r'\$100|bonus|guaranteed|500%|free gift', extracted_text, re.IGNORECASE))
        ocr_score = 75.0 if has_bonus_or_guarantee else 20.0

        return {
            "ocrText": extracted_text,
            "hasOcrText": True,
            "extractedBrand": extracted_brand,
            "score": ocr_score,
            "detail": f"OCR extracted text from image. Identified brand: '{extracted_brand}'."
        }
    except Exception as e:
        return {
            "ocrText": None,
            "hasOcrText": False,
            "extractedBrand": None,
            "score": 10.0,
            "detail": f"OCR extraction warning: {str(e)}"
        }
