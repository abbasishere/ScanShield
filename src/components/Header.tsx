import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, Info, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  onOpenEngineInfo: () => void;
  onClearChat: () => void;
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenEngineInfo, 
  onClearChat,
  isBackendConnected = false 
}) => {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md">
      {/* Left Title & Status */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 shadow-sm">
          <ShieldCheck className="h-5.5 w-5.5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-slate-900 text-sm md:text-base leading-none">
              ScamShield <span className="text-emerald-600 font-bold">India</span>
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              AI Verification Pipeline
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Weighted Evidence Fusion & Official Regulatory Verification
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Live Engine Status Indicator */}
        <div className="flex items-center gap-2 text-xs mr-2 border-r border-slate-200 pr-3">
          {isBackendConnected ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200" title="Connected to live Python FastAPI Intelligence Engine with live WHOIS/DNS/SEBI queries">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-[11px] hidden sm:inline">Live Engine Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-800 border border-amber-200" title="Running in dynamic client-side engine mode. Start FastAPI backend (port 8000) for live WHOIS/DNS inspection.">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="font-medium text-[11px] hidden sm:inline">Local Intelligence</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenEngineInfo}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
          title="Learn how weighted evidence scoring works"
        >
          <Info className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Engine Formula</span>
        </button>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          title="Reset conversation"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};

