import React from 'react';
import { HelpCircle, CloudRain, UserCheck, Activity } from 'lucide-react';
import { AdvisoryResponse, UserProfile } from '../types';

interface ExplainabilityCardProps {
  advisoryData: AdvisoryResponse | null;
  userProfile: UserProfile;
  isLoading: boolean;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  advisoryData,
  userProfile,
  isLoading,
}) => {
  const envFactors = advisoryData?.environmental_factors || [];
  const profileFactors = advisoryData?.personalized_factors || [];
  const attentionLevel = advisoryData?.attention_level || 'Low';
  const riskPriority = advisoryData?.risk_level || 'normal';

  // Attention badge styles
  const getAttentionBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('very high')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (l.includes('high')) return 'bg-orange-50 text-orange-800 border-orange-200';
    if (l.includes('moderate')) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  // Priority badge styles
  const getPriorityBadge = (priority: string) => {
    const p = priority.toLowerCase();
    if (p.includes('high')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (p.includes('moderate')) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-sky-500" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">
                AI EXPLAINABILITY
              </span>
              <h3 className="text-xs text-slate-500 font-medium">Why was this advisory generated?</h3>
            </div>
          </div>
        </div>

        {/* Attention & Priority Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Environmental load:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getAttentionBadge(attentionLevel)}`}>
              {attentionLevel}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Personalized priority:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getPriorityBadge(riskPriority)}`}>
              {riskPriority}
            </span>
          </div>
        </div>

        {/* Two Columns: Environmental factors & Profile relevance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Column 1: Environmental factors */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 mb-3">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Detected Environmental Triggers
              </h4>
            </div>

            {envFactors.length > 0 ? (
              <ul className="space-y-2">
                {envFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700 space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Atmospheric readings remain optimal and within baseline parameters.
              </p>
            )}
          </div>

          {/* Column 2: Profile relevance */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 mb-3">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Individual Profile Match
              </h4>
            </div>

            {profileFactors.length > 0 ? (
              <ul className="space-y-2">
                {profileFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700 space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Standard baseline physiology applies for healthy adult profile.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer reassurance note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-500">
        <Activity className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
        <span>Multi-Factor Reasoning Engine (AirAware PS-4)</span>
      </div>
    </div>
  );
};
