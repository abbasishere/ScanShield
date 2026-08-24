export type RiskLevel = 'LOW_RISK' | 'SUSPICIOUS' | 'HIGH_RISK';

export interface EvidenceItem {
  title: string;
  source: string;
  detail: string;
  type: 'LINK' | 'COMMUNITY' | 'SEBI' | 'DOMAIN' | 'OCR';
  url?: string;
}

export interface ScamAnalysisResult {
  verdictTitle: string;
  riskScore: number; // Final confidence/risk score (0 to 100)
  riskLevel: RiskLevel;
  simpleExplanation: string;
  reasons: string[];
  evidences: EvidenceItem[];
  ocrTextExtracted?: string;
  recommendedAction: string;
  analyzedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  pastedUrl?: string;
  analysisResult?: ScamAnalysisResult;
  isStreaming?: boolean;
}

export interface ScamSample {
  id: string;
  title: string;
  subtitle: string;
  category: 'TELEGRAM' | 'SEBI_FRAUD' | 'PHISHING' | 'GENUINE';
  userMessage: string;
  imageUrl?: string;
  pastedUrl?: string;
  sampleResult: ScamAnalysisResult;
}
