from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any

from app.schemas.scam import ScanRequest, ScanResponse, SebiLookupResponse, UrlLookupResponse
from app.services.fusion_engine import run_evidence_fusion_pipeline
from app.services.sebi_service import verify_sebi_registration
from app.services.url_service import analyze_url_intelligence

router = APIRouter(prefix="/api/v1", tags=["ScamShield Intelligence Engine"])

@router.post("/analyze", response_model=ScanResponse, summary="Analyze Scam Promotion (Text, URL, Image OCR)")
async def analyze_scam_endpoint(request: ScanRequest):
    """
    Evaluates submitted input using the multi-signal weighted evidence fusion formula:
    R = sum(w_i * s_i) / sum(w_i)
    """
    if not request.text and not request.url and not request.image_base64:
        raise HTTPException(status_code=400, detail="At least one input (text, url, or image_base64) must be provided.")
    
    return run_evidence_fusion_pipeline(request)

@router.get("/verify-sebi/{reg_id}", response_model=SebiLookupResponse, summary="Verify SEBI Adviser / Broker ID")
async def verify_sebi_endpoint(reg_id: str):
    """
    Validates registration numbers against official SEBI registry database.
    """
    res = verify_sebi_registration(reg_id)
    return SebiLookupResponse(
        regId=res["regId"],
        isRegistered=res["isRegistered"],
        entityName=res.get("entityName"),
        category=res.get("category"),
        validUntil=res.get("validUntil"),
        status=res["status"],
        details=res["details"]
    )

@router.post("/url-lookup", response_model=UrlLookupResponse, summary="Domain Intelligence & Typosquatting Lookup")
async def url_lookup_endpoint(url: str = Query(..., description="Target website or Telegram URL")):
    """
    Evaluates domain age, typosquatting, TLD risk, and SSL protocol.
    """
    res = analyze_url_intelligence(url)
    return UrlLookupResponse(
        url=res["url"],
        domain=res["domain"],
        creationDate=res.get("creationDate"),
        domainAgeDays=res.get("domainAgeDays"),
        isSuspiciousTld=res["isSuspiciousTld"],
        isTyposquatting=res["isTyposquatting"],
        hasValidSsl=res["hasValidSsl"],
        riskScore=res["riskScore"]
    )

@router.get("/health", summary="Engine Health Check")
async def health_check():
    return {
        "status": "online",
        "service": "ScamShield India Intelligence Engine",
        "version": "2.4.0",
        "sebiRegistryConnection": "CONNECTED",
        "fusionFormula": "R = sum(w_i * s_i) / sum(w_i)"
    }
