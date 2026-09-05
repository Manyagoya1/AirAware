import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Info, 
  Activity, 
  Heart,
  User
} from 'lucide-react';
import { AdvisoryResponse, UserProfile } from '../types';

interface AdvisoryCardProps {
  advisoryData: AdvisoryResponse | null;
  userProfile: UserProfile;
  isLoading: boolean;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({
  advisoryData,
  userProfile,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading && !advisoryData) {
    return (
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between h-full animate-pulse">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100" />
          <div className="h-4 bg-slate-200 rounded w-48" />
        </div>
        <div className="space-y-4 my-6">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-28 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-10 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  const title = advisoryData?.advisory || 'Air quality is favorable for standard daily routines.';
  const riskExplanation = advisoryData?.why_it_matters || 
    'Current atmospheric concentrations remain within safe respiratory limits for your profile.';
  
  const recommendations = advisoryData?.recommendations && advisoryData.recommendations.length > 0
    ? advisoryData.recommendations.slice(0, 3)
    : [
        'Optimal window for outdoor exercise, walking, or cycling.',
        'Keep indoor spaces ventilated with fresh outdoor air while AQI is favorable.',
        'Stay hydrated throughout your schedule to maintain healthy respiratory mucosal barriers.'
      ];

  const riskLevel = advisoryData?.risk_level || 'normal';
  const isHighRisk = riskLevel === 'high';
  const isModerateRisk = riskLevel === 'moderate';

  const riskTag = isHighRisk ? {
    label: 'High Priority Caution',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    cardBg: 'bg-rose-50/70 border-rose-200/80 text-rose-950',
    iconColor: 'text-rose-600',
  } : isModerateRisk ? {
    label: 'Moderate Respiratory Caution',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    cardBg: 'bg-amber-50/70 border-amber-200/80 text-amber-950',
    iconColor: 'text-amber-600',
  } : {
    label: 'Optimal Health Baseline',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cardBg: 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950',
    iconColor: 'text-emerald-600',
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                AI HEALTH ADVISORY
              </span>
              <h3 className="text-xs text-slate-500 font-medium">Tailored for {userProfile.name}</h3>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${riskTag.badge}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{riskTag.label}</span>
          </span>
        </div>

        {/* Advisory Headline */}
        <div className="my-4">
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {title}
          </h4>
        </div>

        {/* Risk & Physiological Impact Box */}
        <div className={`rounded-xl p-4 border mb-4 transition-colors ${riskTag.cardBg}`}>
          <div className="flex items-center space-x-2 mb-1.5 font-bold text-xs uppercase tracking-wider">
            <Heart className={`w-3.5 h-3.5 ${riskTag.iconColor}`} />
            <span>CLINICAL & PHYSIOLOGICAL CONTEXT</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-95">
            {riskExplanation}
          </p>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-xl p-4 bg-slate-50/80 border border-slate-200/80 mb-4">
          <div className="flex items-center space-x-2 text-slate-800 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              RECOMMENDED ACTIONS
            </span>
          </div>
          <ul className="space-y-2.5">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-xs sm:text-sm text-slate-700 space-x-2.5">
                <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-snug">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Accordion: Why am I seeing this? */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors focus:outline-none cursor-pointer"
        >
          <span className="flex items-center space-x-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Why am I receiving this advisory?</span>
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2.5 transition-all">
            <p className="leading-relaxed">
              AirAware's AI engine synthesized this advisory by analyzing current air pollutants (PM2.5, PM10, AQI) combined with thermal conditions and your biological profile:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">User Group:</span>
                <span className="font-bold text-slate-800 capitalize">{userProfile.age_group}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Health Sensitivity:</span>
                <span className="font-bold text-slate-800 capitalize">{userProfile.health_condition}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Activity Routine:</span>
                <span className="font-bold text-slate-800 capitalize">{userProfile.occupation}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Calculated Priority:</span>
                <span className="font-bold text-slate-800 capitalize">{riskLevel}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
