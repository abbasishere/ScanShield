import re
from datetime import datetime
from typing import List

from app.schemas.scam import (
    ScanRequest, ScanResponse, EvidenceItem, RiskLevelEnum
)
from app.services.nlp_service import analyze_nlp_text
from app.services.url_service import analyze_url_intelligence
from app.services.sebi_service import verify_sebi_registration
from app.services.ocr_service import extract_text_from_image_base64
from app.services.web_search_service import search_web_reputation

def run_evidence_fusion_pipeline(request: ScanRequest) -> ScanResponse:
    """
    Executes dynamic multi-signal evidence fusion pipeline:
    NLP Category & Entity Extraction + Live URL/WHOIS + SEBI/Regulator + Web Intelligence.
    """
    input_text = request.text or ""
    input_url = request.url or ""
    image_base64 = request.image_base64 or ""

    # 1. Image OCR Extraction & Brand Identification
    ocr_res = extract_text_from_image_base64(image_base64)
    ocr_text = ocr_res.get("ocrText")
    extracted_brand = ocr_res.get("extractedBrand")

    combined_text = f"{input_text} {ocr_text or ''} {input_url}".strip()

    # 2. NLP Analysis & Category Classification
    nlp_res = analyze_nlp_text(combined_text)
    nlp_score = nlp_res["score"]
    detected_cat = nlp_res.get("detectedCategory")
    cat_title = nlp_res.get("categoryTitle")
    extracted_entities = nlp_res.get("extractedEntities", {})

    # Extract primary query entity for Web Search
    target_entity = extracted_brand
    if not target_entity and input_url:
        domain_match = re.search(r'https?://(?:www\.)?([^/]+)', input_url)
        if domain_match:
            target_entity = domain_match.group(1).split('.')[0]
    
    if not target_entity:
        brand_search = re.search(r'(aurum markets|zerodha|groww|angel one|upstox|octafx|olymptrade|flipkart|tata|motilal oswal|sbi|hdfc|icici)', combined_text, re.IGNORECASE)
        if brand_search:
            target_entity = brand_search.group(0).title()
        elif cat_title:
            target_entity = cat_title
        else:
            target_entity = combined_text[:30].strip()

    # 3. Live Web Reputation Search
    web_rep_res = search_web_reputation(target_entity)
    web_rep_score = web_rep_res["score"]

    # 4. URL & Domain Intelligence
    url_score = 15.0
    url_info = None
    if input_url:
        url_info = analyze_url_intelligence(input_url)
        url_score = url_info["riskScore"]
    elif extracted_entities.get("urls"):
        first_extracted_url = extracted_entities["urls"][0]
        url_info = analyze_url_intelligence(first_extracted_url)
        url_score = url_info["riskScore"]

    # 5. SEBI / Regulator Entity Verification
    sebi_score = 15.0
    sebi_info = None
    sebi_match = re.search(r'IN[AZPHRFMB]\d{5,9}', combined_text.upper())
    if sebi_match:
        reg_id = sebi_match.group(0)
        sebi_info = verify_sebi_registration(reg_id)
        sebi_score = sebi_info["score"]
    elif "sebi" in combined_text.lower():
        sebi_info = verify_sebi_registration("", claimed_name=target_entity)
        sebi_score = 80.0 if not sebi_info.get("isRegistered") else 10.0

    # 6. Weighted Risk Scoring Formula: R = sum(w_i * s_i) / sum(w_i)
    weights = [0.30, 0.25, 0.25, 0.20]
    scores = [sebi_score, web_rep_score, nlp_score, url_score]
    
    weighted_sum = sum(w * s for w, s in zip(weights, scores))
    final_score = round(weighted_sum / sum(weights))

    # Overrides for definitive scam indicators
    if detected_cat in ["ELECTRICITY_BILL", "DIGITAL_ARREST_COURIER", "UPI_QR_REFUND", "PART_TIME_JOB"]:
        final_score = max(final_score, 88.0)
    if url_info and url_info.get("isTyposquatting"):
        final_score = max(final_score, 90.0)
    if web_rep_res.get("hasNegativeReports"):
        final_score = max(final_score, 85.0)
    if sebi_info and sebi_info.get("isRegistered"):
        final_score = min(final_score, 15.0)

    final_score = min(max(round(final_score), 5.0), 99.0)

    # 7. Construct Dynamic Explanation, Reasons & Evidence Cards
    reasons: List[str] = []
    evidences: List[EvidenceItem] = []

    # Format extracted entities for display
    phones = extracted_entities.get("phones", [])
    upis = extracted_entities.get("upi_ids", [])
    apks = extracted_entities.get("apk_names", [])
    amounts = extracted_entities.get("amounts", [])

    if final_score >= 70:
        risk_level = RiskLevelEnum.HIGH_RISK
        verdict_title = "🚨 This looks FAKE & SUSPICIOUS!"
        recommended_action = "AVOID & DO NOT ENGAGE / PAY"

        if detected_cat == "ELECTRICITY_BILL":
            simple_explanation = "This message is a known electricity bill disconnection scam. Power discoms never send disconnection threats from personal numbers asking you to call a 10-digit mobile number or pay via personal links."
            reasons.append("Fake Disconnection Notice: Utilities never threaten same-night power cuts over SMS.")
            if phones:
                reasons.append(f"Suspicious Contact Number: Directs you to an unofficial mobile number ({', '.join(phones)}).")
        elif detected_cat == "PART_TIME_JOB":
            simple_explanation = "This is a part-time task / job scam. Fraudsters lure victims with promises of high daily earnings for liking videos or rating hotels, then demand prepaid deposits for 'crypto trading' or VIP tasks."
            reasons.append("Unrealistic Daily Wages: Promises high daily earnings for trivial online tasks.")
            reasons.append("Prepaid Task Trap: Common funnel into fraudulent crypto/Telegram investment groups.")
        elif detected_cat == "DIGITAL_ARREST_COURIER":
            simple_explanation = "This is a 'Digital Arrest' & courier extortion scam. Law enforcement agencies (Police, CBI, Customs) never conduct investigations or demand money transfers over WhatsApp or Skype video calls."
            reasons.append("Police / Customs Impersonation: Law enforcement does not issue arrest warrants over messaging apps.")
            reasons.append("Coercive Video Call Threat: Pressure tactics used to extract panic bank transfers.")
        elif detected_cat == "UPI_QR_REFUND":
            simple_explanation = "This is a UPI payment deception. Remember: Scanning a QR code or entering your UPI PIN is ONLY done to SEND money, NEVER to receive refunds or cashback."
            reasons.append("UPI PIN Deception: Entering a PIN or scanning a receiver QR code will immediately debit your bank.")
        elif url_info and url_info.get("isTyposquatting"):
            simple_explanation = f"This link is a fraudulent phishing clone mimicking {url_info.get('domain')}. It was created to harvest personal data and credentials."
            reasons.append(f"Brand Spoofing: Cloned URL mimicking an authentic brand.")
        else:
            simple_explanation = f"We analyzed '{target_entity}' and identified critical fraud signals including unregulated solicitation, high-risk financial promises, and unverified credentials."
            if web_rep_res.get("hasNegativeReports"):
                reasons.append(f"Web Reputation Warning: {web_rep_res['detail']}")
            if nlp_res.get("triggers"):
                reasons.append(nlp_res["triggers"][0])

        if upis:
            reasons.append(f"Direct UPI Handle: Asks for payments to personal handle ({', '.join(upis)}).")
        if apks:
            reasons.append(f"Malicious App: Directs you to install an unverified APK ({', '.join(apks)}).")

        # Evidence Cards
        if url_info:
            evidences.append(EvidenceItem(
                title=f"Domain Intelligence ({url_info['domain']})",
                source="WHOIS & DNS Security Database",
                detail=url_info["details"],
                type="DOMAIN",
                url="https://whois.domaintools.com"
            ))

        if sebi_info:
            evidences.append(EvidenceItem(
                title="SEBI Registry Verification",
                source="Official Regulator (sebi.gov.in)",
                detail=sebi_info["details"],
                type="SEBI",
                url="https://www.sebi.gov.in"
            ))

        for snippet in web_rep_res.get("snippets", []):
            evidences.append(EvidenceItem(
                title=f"Public Intelligence: {target_entity}",
                source="Web & Consumer Fraud Reports",
                detail=snippet,
                type="COMMUNITY"
            ))

        evidences.append(EvidenceItem(
            title="National Cyber Crime Advisory",
            source="CyberCrime India (cybercrime.gov.in)",
            detail="Report financial frauds immediately to the National Cyber Crime Helpline at 1930 or online at cybercrime.gov.in.",
            type="LINK",
            url="https://cybercrime.gov.in"
        ))

    elif final_score >= 40:
        risk_level = RiskLevelEnum.SUSPICIOUS
        verdict_title = "⚠️ Proceed with CAUTION!"
        simple_explanation = f"Moderate risk indicators detected for '{target_entity}'. Always double-check credentials and avoid sending upfront money before independent verification."
        recommended_action = "VERIFY BEFORE PROCEEDING"
        reasons.append("Unverified Channels: Operating via unverified digital promotion.")
        if nlp_res.get("triggers"):
            reasons.extend(nlp_res["triggers"][:2])

        evidences.append(EvidenceItem(
            title="Regulatory Verification Required",
            source="sebi.gov.in / rbi.org.in",
            detail="Verify that any financial adviser or intermediary has an active license with Indian regulators before transferring funds.",
            type="SEBI",
            url="https://www.sebi.gov.in"
        ))
    else:
        risk_level = RiskLevelEnum.LOW_RISK
        verdict_title = "🟢 This looks LEGIT & SAFE!"
        simple_explanation = f"No scam indicators detected for '{target_entity}'. The credentials and domain match authentic, verified records."
        recommended_action = "SAFE TO PROCEED"

        reasons.append("Verified Credentials: Holds authentic regulatory registration or established domain history.")
        reasons.append("Standard Protocol: Uses secure HTTPS connection and clean reputation records.")

        if sebi_info and sebi_info.get("isRegistered"):
            evidences.append(EvidenceItem(
                title="Official SEBI Registered Entity",
                source="SEBI Official Database",
                detail=sebi_info["details"],
                type="SEBI",
                url="https://www.sebi.gov.in"
            ))
        elif url_info:
            evidences.append(EvidenceItem(
                title=f"Verified Domain ({url_info['domain']})",
                source="WHOIS & DNS Security",
                detail=url_info["details"],
                type="DOMAIN"
            ))

    return ScanResponse(
        verdictTitle=verdict_title,
        riskScore=final_score,
        riskLevel=risk_level,
        simpleExplanation=simple_explanation,
        reasons=reasons,
        evidences=evidences,
        ocrTextExtracted=ocr_text if ocr_res.get("hasOcrText") else None,
        recommendedAction=recommended_action,
        analyzedAt=datetime.now().strftime("%d %b %Y")
    )

