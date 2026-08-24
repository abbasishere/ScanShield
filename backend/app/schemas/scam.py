from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class RiskLevelEnum(str, Enum):
    LOW_RISK = "LOW_RISK"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_RISK = "HIGH_RISK"

class EvidenceItem(BaseModel):
    title: str
    source: str
    detail: str
    type: str # 'LINK' | 'COMMUNITY' | 'SEBI' | 'DOMAIN' | 'OCR'
    url: Optional[str] = None

class ScanRequest(BaseModel):
    text: Optional[str] = Field(None, description="Pasted promotion text, message, or claim")
    url: Optional[str] = Field(None, description="Pasted website link or Telegram URL")
    image_base64: Optional[str] = Field(None, description="Optional base64 encoded screenshot")

class ScanResponse(BaseModel):
    verdictTitle: str # e.g. "This looks FAKE & SUSPICIOUS" or "This looks LEGIT & SAFE"
    riskScore: float = Field(..., ge=0, le=100) # Final single confidence score
    riskLevel: RiskLevelEnum
    simpleExplanation: str # Simple plain English explanation
    reasons: List[str] # Simple bullet points explaining why
    evidences: List[EvidenceItem] # Combined link and plain text evidence cards
    ocrTextExtracted: Optional[str] = None
    recommendedAction: str
    analyzedAt: str

class SebiLookupResponse(BaseModel):
    regId: str
    isRegistered: bool
    entityName: Optional[str] = None
    category: Optional[str] = None
    validUntil: Optional[str] = None
    status: str
    details: str

class UrlLookupResponse(BaseModel):
    url: str
    domain: str
    creationDate: Optional[str] = None
    domainAgeDays: Optional[int] = None
    isSuspiciousTld: bool
    isTyposquatting: bool
    hasValidSsl: bool
    riskScore: float
