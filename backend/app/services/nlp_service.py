import os
import re
from typing import Dict, Any, List, Optional

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

SCAM_CATEGORIES = {
    "ELECTRICITY_BILL": {
        "pattern": r'electricity|power|disconnected|bill update|light cut|officer\s*\d{10}|bill overdue',
        "title": "Electricity / Utility Bill Disconnection Fraud",
        "description": "Scammers send fake SMS claiming imminent power disconnection and direct victims to call a personal mobile number or download a malicious APK.",
        "danger_level": 92
    },
    "PART_TIME_JOB": {
        "pattern": r'part[-\s]?time|work from home|like\s+(youtube|video|instagram)|hotel rating|google review|earn\s*(₹|rs|\$)?\s*\d{3,5}\s*(daily|per day)|daily payout|telegram task',
        "title": "Part-Time Task / YouTube Like Job Fraud",
        "description": "Offers easy money for liking videos or writing reviews. Starts with small payouts, then traps victims in prepaid tasks requiring heavy deposits.",
        "danger_level": 94
    },
    "DIGITAL_ARREST_COURIER": {
        "pattern": r'fedex|customs|illegal goods|drugs found|cbi|mumbai police|digital arrest|narcotics|dhl|arrest warrant|skype|passport seized',
        "title": "Digital Arrest / Courier / Police Impersonation Fraud",
        "description": "Criminals pose as customs, police, or courier officials alleging illegal items were found in your parcel, coercing victims via video calls into transferring funds.",
        "danger_level": 98
    },
    "INVESTMENT_FOREX_TELEGRAM": {
        "pattern": r'guaranteed\s*(return|profit)|500%|100%|daily profit|forex trading|vip (channel|group)|double money|zero risk|100x|10x|crypto mining',
        "title": "High-Yield Investment / Telegram Forex Fraud",
        "description": "Promises unrealistic guaranteed profits, fakes trading dashboards, and directs victims into unregulated Telegram groups.",
        "danger_level": 90
    },
    "LOAN_APP_EXTORTION": {
        "pattern": r'instant loan|no cibil|loan approved|disbursal in 5 min|contact access|download apk to get loan',
        "title": "Predatory Loan App & Contact Extortion Fraud",
        "description": "Unregistered instant loan apps harvest victim contact lists and photos, later blackmailing them with morphed images and extortionate interest.",
        "danger_level": 95
    },
    "UPI_QR_REFUND": {
        "pattern": r'scan qr to receive|enter upi pin to receive|money sent by mistake|refund bonus|paytm cashback|scratch card',
        "title": "UPI QR Code / Fake Refund Fraud",
        "description": "Scammers trick victims into scanning QR codes or typing their UPI PIN to 'receive' money or refunds (entering a PIN ALWAYS debits your account).",
        "danger_level": 93
    },
        "LOTTERY_KYC_BLOCKED": {
        "pattern": r'kbc|lottery winner|account blocked|pan link|update kyc|sim blocked|card de-activated',
        "title": "Phishing KYC / Lottery Scam",
        "description": "Fake notifications claiming your bank or SIM is blocked unless you click a link and enter personal credentials or OTPs.",
        "danger_level": 88
    },

    "BANK_IMPERSONATION": {
        "pattern": r'sbi|hdfc|icici|axis bank|bank account|account will be blocked|account suspended|bank officer|bank manager|verify your account|otp|atm card blocked',
        "title": "Bank Impersonation / Account Fraud",
        "description": "Scammers impersonate banks or bank officials to create urgency and trick victims into sharing OTPs, PINs, passwords, or transferring money.",
        "danger_level": 94
    },

    "PHISHING": {
        "pattern": r'click (this )?link|verify your account|login immediately|confirm your identity|enter otp|enter password|enter pin|update your details|security alert|suspicious login',
        "title": "Phishing / Credential Theft",
        "description": "Fraudulent messages attempt to steal passwords, OTPs, PINs, or personal information through fake verification requests or links.",
        "danger_level": 93
    },

    "SIM_DEACTIVATION": {
        "pattern": r'sim.*(blocked|deactivated|suspended)|mobile number.*(blocked|deactivated)|sim kyc|re-?activate.*sim|telecom.*kyc',
        "title": "SIM Deactivation / KYC Scam",
        "description": "Scammers falsely claim that a mobile number or SIM will be deactivated unless the victim completes a fake KYC process or shares sensitive information.",
        "danger_level": 90
    },

    "LOTTERY_PRIZE": {
        "pattern": r'you (have )?won|congratulations.*(winner|prize)|lottery.*(winner|prize)|prize money|claim your prize|processing fee.*prize|tax.*prize|jackpot',
        "title": "Fake Lottery / Prize Scam",
        "description": "Scammers falsely claim that victims have won money or a prize and then demand taxes, processing fees, or personal information.",
        "danger_level": 92
    },

    "COURIER_CUSTOMS": {
        "pattern": r'parcel.*(customs|illegal|seized)|customs.*(fee|payment)|courier.*(fee|payment)|package.*(seized|illegal)|fedex|dhl|customs officer',
        "title": "Courier / Customs Impersonation Scam",
        "description": "Scammers impersonate courier or customs officials and demand money or personal information over an alleged illegal or seized parcel.",
        "danger_level": 96
    },

    "CRYPTO_SCAM": {
        "pattern": r'crypto.*(guaranteed|profit|investment)|bitcoin.*(profit|investment)|ethereum.*(profit|investment)|crypto mining|double your crypto|crypto giveaway|wallet.*(connect|verify)',
        "title": "Cryptocurrency Investment Scam",
        "description": "Fraudulent cryptocurrency schemes promise unrealistic profits, fake giveaways, mining returns, or request access to cryptocurrency wallets.",
        "danger_level": 94
    },

    "ROMANCE_SCAM": {
        "pattern": r'online (boyfriend|girlfriend|relationship)|dating.*(money|transfer)|send money.*(emergency|hospital|ticket)|emergency.*(money|transfer)|gift.*customs fee',
        "title": "Romance / Relationship Scam",
        "description": "Scammers build online relationships and eventually invent emergencies or fees to pressure victims into sending money.",
        "danger_level": 88
    },

    "CHARITY_SCAM": {
        "pattern": r'donate.*(urgent|immediately)|charity.*(donation|payment)|relief fund|medical fundraiser|emergency donation|help.*(victims|children).*donation',
        "title": "Fake Charity / Donation Scam",
        "description": "Fraudsters use fake emergencies, charities, or fundraisers to collect money through deceptive donation requests.",
        "danger_level": 85
    },
    "FINANCIAL_CREDENTIAL_THEFT": {
        "pattern": r'give me.*(otp|cvv|card number|credit card|debit card)|send me.*(otp|cvv|card number|credit card|debit card)|share.*(otp|cvv|card details|card number|password|pin)|provide.*(otp|cvv|card details|card number|password|pin)|tell me.*(otp|cvv|card number|pin)',
        "title": "Financial Credential Theft",
        "description": "Requests for OTPs, CVVs, card numbers, PINs, passwords, or other sensitive financial credentials can enable unauthorized access or fraudulent transactions.",
        "danger_level": 98
    }
}
def extract_entities(text: str) -> Dict[str, List[str]]:
    """Extracts phone numbers, UPI IDs, URLs, and currency amounts."""
    entities: Dict[str, List[str]] = {
        "phones": [],
        "upi_ids": [],
        "amounts": [],
        "urls": [],
        "apk_names": []
    }
    
    if not text:
        return entities

    # Phone numbers (+91 or 10-digit Indian numbers)
    phones = re.findall(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b', text)
    entities["phones"] = list(set(phones))

    # UPI IDs (e.g. user@okhdfcbank, fraud@ybl)
    upi_ids = re.findall(r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}', text)
    valid_upis = [u for u in upi_ids if any(handle in u.lower() for handle in ['upi', 'ok', 'ybl', 'axl', 'ibl', 'paytm', 'barodampay', 'federal', 'idfc'])]
    entities["upi_ids"] = list(set(valid_upis if valid_upis else upi_ids[:2]))

    # Amounts
    amounts = re.findall(r'(?:₹|Rs\.?|USD|\$)\s*[\d,]+', text, re.IGNORECASE)
    entities["amounts"] = list(set(amounts))

    # URLs
    urls = re.findall(r'https?://[^\s<>"]+|t\.me/[^\s<>"]+|wa\.me/[^\s<>"]+', text, re.IGNORECASE)
    entities["urls"] = list(set(urls))

    # APK files
    apks = re.findall(r'[\w\-]+\.apk', text, re.IGNORECASE)
    entities["apk_names"] = list(set(apks))

    return entities

def analyze_nlp_text(text: str) -> Dict[str, Any]:
    """
    Analyzes submitted copy for scam language, urgency triggers, psychological manipulation,
    and classifies the specific scam category.
    """
    if not text:
        return {
            "score": 10.0,
            "metricLabel": "No Text Input",
            "detectedCategory": None,
            "categoryTitle": None,
            "categoryDescription": None,
            "extractedEntities": extract_entities(""),
            "triggers": [],
            "detail": "No natural language copy provided for NLP analysis."
        }

    text_lower = text.lower()
    entities = extract_entities(text)
    
    triggers = []
    detected_category_key = None
    category_info = None
    score = 15.0

    # 1. Match specific scam categories
    matched_categories = []
    for cat_key, cat_data in SCAM_CATEGORIES.items():
        if re.search(cat_data["pattern"], text_lower):
            matched_categories.append((cat_key, cat_data))
            score = max(score, float(cat_data["danger_level"]))
            triggers.append(f"Identified Pattern: {cat_data['title']}")
    if matched_categories:
        detected_category_key = matched_categories[0][0]
        category_info = matched_categories[0][1]        

    # 2. General manipulation triggers
    if re.search(r'hurry|limited slots|today only|act fast|immediately|urgent|within \d+ hours|tonight', text_lower):
        score += 15.0
        triggers.append("High Urgency / Coercive Time Pressure")

    if re.search(r'telegram|t\.me|whatsapp|wa\.me|vip channel|dm me', text_lower):
        score += 15.0
        triggers.append("Directs User to Informal Encrypted Messenger")

    if entities["phones"]:
        triggers.append(f"Contains Direct Calling Number(s): {', '.join(entities['phones'][:2])}")

    if entities["upi_ids"]:
        score += 20.0
        triggers.append(f"Requests Direct Peer UPI Transfer: {', '.join(entities['upi_ids'][:2])}")

    if entities["apk_names"]:
        score += 35.0
        triggers.append(f"Promotes Untrusted APK Download: {', '.join(entities['apk_names'])}")

    if re.search(r'sebi|govt approved|rbi approved|police officer|cbi officer', text_lower):
        if score > 40.0:
            triggers.append("Uses Impersonation of Regulatory or Government Authorities")

    final_score = min(max(score, 10.0), 99.0)

    if final_score >= 70:
        metric_label = "High-Risk Scam Manipulation"
    elif final_score >= 35:
        metric_label = "Suspicious Communication"
    else:
        metric_label = "Standard Communication"

    detail_str = category_info["description"] if category_info else (
        f"Detected {len(triggers)} warning indicators: " + "; ".join(triggers) if triggers else "Text exhibits standard neutral communication style."
    )

    return {
        "score": final_score,
        "metricLabel": metric_label,
        "detectedCategory": detected_category_key,
        "categoryTitle": category_info["title"] if category_info else "Unclassified Promotion",
        "categoryDescription": category_info["description"] if category_info else None,
        "extractedEntities": entities,
        "triggers": triggers,
        "detail": detail_str
    }

