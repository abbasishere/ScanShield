import React from 'react';
import { Plus, MessageSquare, ShieldAlert, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { ScamSample } from '../types/scam';
import { HACKATHON_SAMPLES } from '../services/evidenceEngine';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectSample: (sample: ScamSample) => void;
  onNewAnalysis: () => void;
  activeSampleId?: string;
  chatHistoryTitles: { id: string; title: string; riskLevel?: string }[];
  onSelectHistoryItem: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onSelectSample,
  onNewAnalysis,
  activeSampleId,
  chatHistoryTitles,
  onSelectHistoryItem,
}) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-slate-100 text-slate-800 transition-all duration-300 ease-in-out md:static ${
          isOpen ? 'w-72' : 'w-0 md:w-16'
        } overflow-hidden`}
      >
        {/* Top Branding & New Scan */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200/80 px-3">
          {isOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight">ScamShield AI</span>
            </div>
          ) : (
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          )}

          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* New Analysis Button */}
        <div className="p-3">
          <button
            onClick={onNewAnalysis}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] ${
              !isOpen && 'md:px-0'
            }`}
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            {isOpen && <span>New Scam Analysis</span>}
          </button>
        </div>

        {/* Sidebar Content (Visible when expanded) */}
        {isOpen ? (
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
            {/* Hackathon Test Cases Section */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Demo Scam Scenarios</span>
              </div>
              <div className="space-y-1.5">
                {HACKATHON_SAMPLES.map((sample) => {
                  const isSelected = activeSampleId === sample.id;
                  const isHighRisk = sample.sampleResult.riskLevel === 'HIGH_RISK';
                  return (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className={`group flex w-full flex-col text-left rounded-xl p-2.5 text-xs transition-all border ${
                        isSelected
                          ? 'border-emerald-500/40 bg-white shadow-sm ring-1 ring-emerald-500/30'
                          : 'border-transparent bg-slate-200/50 hover:bg-white hover:border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {sample.title}
                        </span>
                        {isHighRisk ? (
                          <span className="flex-shrink-0 rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            HIGH
                          </span>
                        ) : (
                          <span className="flex-shrink-0 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            SAFE
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                        {sample.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat History Section */}
            {chatHistoryTitles.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                  <span>Recent Scan History</span>
                </div>
                <div className="space-y-1">
                  {chatHistoryTitles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectHistoryItem(item.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-700 hover:bg-white hover:shadow-xs transition-all text-left"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate flex-1 font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mini Icon View for Collapsed Sidebar */
          <div className="hidden md:flex flex-1 flex-col items-center gap-4 py-4">
            {HACKATHON_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-xs"
                title={sample.title}
              >
                {sample.sampleResult.riskLevel === 'HIGH_RISK' ? (
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Footer info */}
        {isOpen && (
          <div className="border-t border-slate-200/80 p-3 text-[11px] text-slate-500 bg-slate-100">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>ScamShield v1.0</span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">
                Formula v2.4
              </span>
            </div>
            <p className="mt-1 text-slate-500 text-[10px]">
              Evidence Fusion: Weighted Signal Score + Rule-Based Risk Engine
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
