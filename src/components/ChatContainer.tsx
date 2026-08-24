import React, { useRef, useEffect } from 'react';
import { ShieldCheck, User, Sparkles, UploadCloud, Link, ArrowRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { ChatMessage, ScamSample } from '../types/scam';
import { ScamAnalysisCard } from './ScamAnalysisCard';
import { HACKATHON_SAMPLES } from '../services/evidenceEngine';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectSample: (sample: ScamSample) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onSelectSample
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Empty / Welcome State */}
      {messages.length === 0 && (
        <div className="mx-auto max-w-3xl py-8 space-y-8">
          {/* Hero Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400 shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Can I Trust This Investment?
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Paste a URL, WhatsApp message, Telegram tip, or upload a screenshot. ScamShield verifies official SEBI registrations, analyzes domain risk, and delivers a weighted evidence score.
            </p>
          </div>

          {/* Pipeline Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">SEBI Registration Check</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Verifies claimed adviser & broker licenses against official regulatory registries.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-2">
                <Link className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">URL & Domain Intelligence</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Identifies typosquatting, fresh domain registrations, and anonymous redirects.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 mb-2">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Weighted Evidence Fusion</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Combines NLP, OCR, and scam pattern matching into an explainable 0–100 risk score.
              </p>
            </div>
          </div>

          {/* Quick Hackathon Demo Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Test Interactive Scam Examples</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HACKATHON_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="group flex flex-col justify-between text-left rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-500 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {sample.title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                      "{sample.userMessage}"
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2 text-[10px]">
                    <span className="font-semibold text-slate-600 uppercase tracking-wide">Expected Result:</span>
                    {sample.sampleResult.riskLevel === 'HIGH_RISK' ? (
                      <span className="font-extrabold text-rose-600">🔴 High Risk ({sample.sampleResult.riskScore}/100)</span>
                    ) : (
                      <span className="font-extrabold text-emerald-600">🟢 Safe ({sample.sampleResult.riskScore}/100)</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.role === 'user' ? (
              /* User Message Card */
              <div className="flex items-start justify-end gap-3">
                <div className="max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xs">
                  {/* Image Attachment Preview */}
                  {message.imageUrl && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                      <img
                        src={message.imageUrl}
                        alt="Uploaded for OCR"
                        className="max-h-56 w-full object-cover"
                      />
                      <div className="p-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> Attached Screenshot for OCR Scanning
                      </div>
                    </div>
                  )}

                  {/* Pasted URL Badge */}
                  {message.pastedUrl && (
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-300 border border-slate-700">
                      <Link className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="truncate max-w-xs">{message.pastedUrl}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 flex-shrink-0 text-xs font-bold">
                  <User className="h-4 w-4" />
                </div>
              </div>
            ) : (
              /* Assistant Message Response */
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 flex-shrink-0 shadow-xs">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 max-w-[92%] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">ScamShield Assistant</span>
                    <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                  </div>

                  {message.isStreaming ? (
                    /* Streaming Loader State */
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-pulse-subtle">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-slate-200 animate-spin" />
                        <div className="h-4 w-48 rounded bg-slate-200" />
                      </div>
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-4/5 rounded bg-slate-100" />
                      <div className="h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                  ) : message.analysisResult ? (
                    /* Render Full Scam Analysis Result Card */
                    <ScamAnalysisCard
                      result={message.analysisResult}
                      pastedUrl={message.pastedUrl}
                      imageUrl={message.imageUrl}
                    />
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 flex-shrink-0 animate-pulse">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 flex items-center gap-2 shadow-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Analyzing NLP signals, SEBI registry, domain age & OCR text...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
