import urllib.parse
import httpx
import re
from typing import Dict, Any, List

KNOWN_REPUTATIONS = {
    "zerodha": {
        "score": 5.0,
        "hasNegative": False,
        "detail": "Verified top-tier Indian stock broker, active since 2010 with positive regulatory standing.",
        "snippets": ["Zerodha is India's largest retail stockbroker, registered with SEBI and NSE/BSE."]
    },
    "groww": {
        "score": 5.0,
        "hasNegative": False,
        "detail": "Verified SEBI registered investment & stock broking platform.",
        "snippets": ["Groww is a recognized fintech platform in India with active SEBI intermediary registration."]
    },
    "angel one": {
        "score": 5.0,
        "hasNegative": False,
        "detail": "Long-established SEBI registered full-service stock broker.",
        "snippets": ["Angel One Ltd. is a publicly listed Indian stockbroker member of NSE, BSE, MCX."]
    },
    "octafx": {
        "score": 90.0,
        "hasNegative": True,
        "detail": "Included on Reserve Bank of India (RBI) Alert List of unauthorized forex trading platforms.",
        "snippets": ["RBI Alert List: OctaFX is not authorized to deal in forex trading or operate electronic trading platforms in India."]
    },
    "olymptrade": {
        "score": 90.0,
        "hasNegative": True,
        "detail": "Included on RBI Alert List of unauthorized binary options & forex trading portals.",
        "snippets": ["RBI Alert List: Olymp Trade is an offshore unregistered platform flagged by Indian authorities."]
    },
    "aurum markets": {
        "score": 92.0,
        "hasNegative": True,
        "detail": "Offshore unregulated forex entity flagged for withdrawal delays and aggressive marketing.",
        "snippets": ["Consumer warnings: Aurum Markets lacks Tier-1 regulatory licenses and uses aggressive signup bonuses."]
    }
}

def search_web_reputation(query_entity: str) -> Dict[str, Any]:
    """
    Performs web intelligence search for a company, domain, or broker name
    to check for online scam reports, missing regulator licenses, and withdrawal complaints.
    """
    if not query_entity or len(query_entity.strip()) < 3:
        return {
            "score": 15.0,
            "hasNegativeReports": False,
            "snippets": [],
            "detail": "No specific brand or company query detected for web search."
        }

    clean_query = query_entity.strip().lower()

    # Check fast known directory
    for brand_key, rep_data in KNOWN_REPUTATIONS.items():
        if brand_key in clean_query:
            return {
                "score": rep_data["score"],
                "hasNegativeReports": rep_data["hasNegative"],
                "snippets": rep_data["snippets"],
                "detail": f"Web Intelligence Profile: {rep_data['detail']}"
            }

    search_term = f"{clean_query} scam complaints regulatory alert"

    snippets: List[str] = []
    has_negative_reports = False
    score = 15.0

    # 1. Live DuckDuckGo HTML scraping
    try:
        encoded_query = urllib.parse.quote(search_term)
        url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }

        with httpx.Client(timeout=3.5, follow_redirects=True) as client:
            resp = client.get(url, headers=headers)
            if resp.status_code == 200:
                html_text = resp.text
                raw_snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html_text, re.DOTALL)
                clean_snippets = [re.sub(r'<[^>]+>', '', s).strip() for s in raw_snippets[:4]]

                for s in clean_snippets:
                    if re.search(r'scam|fraud|unregulated|warning|complaint|withdrawal|fake|stole|rbi alert|wikifx|cyber crime|police alert', s, re.IGNORECASE):
                        if len(clean_query) > 3 and clean_query in s.lower():
                            has_negative_reports = True
                            score += 25.0
                            snippets.append(s)
                        elif len(clean_query) <= 3:
                            has_negative_reports = True
                            score += 25.0
                            snippets.append(s)

                score = min(score, 92.0)
    except Exception as e:
        print(f"Web search lookup note: {e}")

    # 2. Fallback to DuckDuckGo Instant Answer API if HTML empty
    if not snippets and not has_negative_reports:
        try:
            api_url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(clean_query)}&format=json&no_html=1"
            with httpx.Client(timeout=2.5) as client:
                api_resp = client.get(api_url)
                if api_resp.status_code == 200:
                    api_data = api_resp.json()
                    abstract = api_data.get("AbstractText")
                    if abstract:
                        snippets.append(abstract[:180] + "...")
        except Exception:
            pass

    if not snippets and has_negative_reports:
        snippets.append(f"Public web search returned alert indicators for '{query_entity}'.")

    return {
        "score": score if has_negative_reports else 15.0,
        "hasNegativeReports": has_negative_reports,
        "snippets": snippets[:3],
        "detail": f"Web intelligence search for '{query_entity}': " + (
            "Found multiple negative user reports & regulatory warnings online." if has_negative_reports else "No critical public scam complaints flagged."
        )
    }

