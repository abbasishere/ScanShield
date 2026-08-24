import React from 'react';
import { X, ShieldCheck, Scale, Cpu, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';

interface EngineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EngineInfoModal: React.FC<EngineInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-elevation-high text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Weighted Evidence Fusion Architecture
              </h3>
              <p className="text-xs text-slate-500">
                ScamShield India Risk Calculation Formula
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 text-xs text-slate-700">
          {/* Mathematical Formula Box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
              Weighted Risk Scoring Formula
            </span>
            <div className="my-2 py-3 px-4 rounded-lg bg-white border border-emerald-200 font-mono text-base font-extrabold text-slate-900 shadow-2xs">
              R = ( Σ wᵢ · sᵢ ) / ( Σ wᵢ )
            </div>
            <p className="mt-2 text-[11px] text-emerald-900 leading-relaxed">
              Where <strong className="font-bold">R</strong> is the final risk score (0–100), <strong className="font-bold">sᵢ</strong> is the score produced by signal <strong className="font-bold">i</strong>, and <strong className="font-bold">wᵢ</strong> is the reliability weight.
            </p>
          </div>

          {/* Signals & Weights Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-slate-500" />
              <span>Multi-Signal Reliability Weights</span>
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Signal Component</th>
                    <th className="py-2.5 px-3">Weight (wᵢ)</th>
                    <th className="py-2.5 px-3">Evaluation Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Official SEBI Registry</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">0.30 (30%)</td>
                    <td className="py-2 px-3 text-slate-600">Cross-references registration IDs against official SEBI adviser database.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">NLP Scam Language</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">0.20 (20%)</td>
                    <td className="py-2 px-3 text-slate-600">Detects urgency, guaranteed profit claims, and emotional manipulation.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Scam Pattern Database</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">0.20 (20%)</td>
                    <td className="py-2 px-3 text-slate-600">Compares indicators against intelligence logs of known scam campaigns.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">URL & Domain Age</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">0.15 (15%)</td>
                    <td className="py-2 px-3 text-slate-600">Evaluates domain age, typosquatting, TLD risk, SSL, and redirect chain.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Web Reputation / Reports</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">0.15 (15%)</td>
                    <td className="py-2 px-3 text-slate-600">Searches public threat databases and cybercrime user report logs.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* High-Confidence Rule Override Section */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-xs mb-1">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <span>High-Confidence Rule Override Mechanism</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              If an adviser claims SEBI registration but fails official verification, or if a domain impersonates a regulated financial brand, the system executes a <strong>rule-based override</strong> elevating the risk score to high risk (&gt; 85/100) regardless of lower average NLP or web scores.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
