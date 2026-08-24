import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Globe,
  ScanText,
  MessageSquare,
  Building2,
  FileText
} from 'lucide-react';
import { ScamAnalysisResult, EvidenceItem } from '../types/scam';

interface ScamAnalysisCardProps {
  result: ScamAnalysisResult;
  pastedUrl?: string;
  imageUrl?: string;
}

export const ScamAnalysisCard: React.FC<ScamAnalysisCardProps> = ({
  result,
  pastedUrl,
  imageUrl
}) => {
  const [copied, setCopied] = useState(false);

  const isHighRisk = result.riskLevel === 'HIGH_RISK';
  const isSuspicious = result.riskLevel === 'SUSPICIOUS';

  const themeConfig = {
    HIGH_RISK: {
      bgLight: 'bg-rose-50/90 border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      badgeSubtle: 'bg-rose-100 text-rose-800 border-rose-200',
      ringColor: '#dc2626',
      textColor: 'text-rose-700',
      icon: ShieldAlert,
    },
    SUSPICIOUS: {
      bgLight: 'bg-amber-50/90 border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
      badgeSubtle: 'bg-amber-100 text-amber-800 border-amber-200',
      ringColor: '#d97706',
      textColor: 'text-amber-700',
      icon: AlertTriangle,
    },
    LOW_RISK: {
      bgLight: 'bg-emerald-50/90 border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      badgeSubtle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      ringColor: '#059669',
      textColor: 'text-emerald-700',
      icon: ShieldCheck,
    }
  }[result.riskLevel];

  const IconComponent = themeConfig.icon;

  const handleCopyReport = () => {
    const reportText = `[ScamShield Analysis Report]\nVerdict: ${result.verdictTitle}\nFinal Risk Score: ${result.riskScore}/100\nExplanation: ${result.simpleExplanation}\nReasons:\n${result.reasons.map(r => `• ${r}`).join('\n')}\nVerified via ScamShield India AI`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'COMMUNITY':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'SEBI':
        return <Building2 className="h-4 w-4 text-emerald-600" />;
      case 'OCR':
        return <ScanText className="h-4 w-4 text-amber-600" />;
      case 'DOMAIN':
        return <Globe className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className={`mt-3 overflow-hidden rounded-2xl border ${themeConfig.bgLight} bg-white shadow-card-light transition-all`}>
      {/* User-Friendly Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${themeConfig.badgeBg} shadow-xs`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-extrabold tracking-tight ${themeConfig.textColor}`}>
              {result.verdictTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified on {result.analyzedAt} • Simple AI Scam Shield
            </p>
          </div>
        </div>

        {/* Single Final Risk Score Dial */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative flex items-center justify-center">
            <svg className="h-12 w-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke={themeConfig.ringColor}
                strokeWidth="5"
                strokeDasharray="113.1"
                strokeDashoffset={113.1 - (113.1 * result.riskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-sm font-extrabold leading-none ${themeConfig.textColor}`}>
                {result.riskScore}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Risk Score</span>
            <span className={`text-xs font-extrabold ${themeConfig.textColor}`}>
              {result.riskScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 space-y-5">
        {/* Simple English Plain Explanation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Why this verdict?
          </h4>
          <p className="text-sm font-medium leading-relaxed text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {result.simpleExplanation}
          </p>
        </div>

        {/* Key Reasons (Simple Bullet Points) */}
        {result.reasons && result.reasons.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Reasons Detected
            </h4>
            <ul className="space-y-2">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className={`mt-1 flex h-2 w-2 flex-shrink-0 rounded-full ${isHighRisk ? 'bg-rose-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Attached Evidences (Links & Plain Text Evidence Cards) */}
        {result.evidences && result.evidences.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <span>Attached Evidences & References ({result.evidences.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.evidences.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs transition-all hover:bg-white hover:border-slate-300 hover:shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                      <div className="flex items-center gap-2">
                        {getEvidenceIcon(ev.type)}
                        <span className="line-clamp-1">{ev.title}</span>
                      </div>
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-[11px] font-bold"
                        >
                          Link <ExternalLink className="h-3 w-3 inline" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {ev.detail}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5">
                    <span className="font-semibold text-slate-500">{ev.source}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-700 font-medium">{ev.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OCR Extracted Text Preview */}
        {result.ocrTextExtracted && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <ScanText className="h-4 w-4 text-emerald-600" />
              <span>Extracted Image OCR Text:</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-1 max-h-28 overflow-y-auto">
              {result.ocrTextExtracted}
            </pre>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Recommended Action:</span>
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-extrabold text-white shadow-xs ${themeConfig.badgeBg}`}>
              {result.recommendedAction}
            </span>
          </div>

          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
