import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, AlertTriangle, AlertCircle, Crosshair } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroGreetingProps {
  userProfile: UserProfile;
  city: string;
  onCityChange: (newCity: string) => void;
  updatedTime: string;
  attentionLevel: string;
  riskLevel: string;
  isLoading: boolean;
  onLocateMe?: () => void;
}

export const HeroGreeting: React.FC<HeroGreetingProps> = ({
  userProfile,
  city,
  onCityChange,
  updatedTime,
  attentionLevel,
  riskLevel,
  isLoading,
  onLocateMe,
}) => {
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [inputCity, setInputCity] = useState(city);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      onCityChange(inputCity.trim());
      setIsEditingCity(false);
    }
  };

  // Status configuration
  const isHighRisk = riskLevel?.toLowerCase() === 'high' || attentionLevel?.toLowerCase().includes('high');
  const isModerateRisk = riskLevel?.toLowerCase() === 'moderate' || attentionLevel?.toLowerCase() === 'moderate';

  const statusLabel = isHighRisk
    ? 'Attention required'
    : isModerateRisk
    ? 'Elevated caution'
    : 'Monitoring normally';

  const statusClasses = isHighRisk
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isModerateRisk
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const StatusIcon = isHighRisk ? AlertCircle : isModerateRisk ? AlertTriangle : CheckCircle2;

  return (
    <section className="w-full pt-2 pb-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Greeting & Location */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">{userProfile.name || 'Friend'}</span>
          </h1>

          <div className="flex flex-wrap items-center text-sm text-slate-600 mt-1.5 gap-x-2 gap-y-1">
            {/* City selector / trigger */}
            {isEditingCity ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    placeholder="Enter city (e.g. Indore)"
                    autoFocus
                    className="py-1 px-2.5 pr-8 rounded-lg border border-blue-400 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                  />
                  {onLocateMe && (
                    <button
                      type="button"
                      onClick={onLocateMe}
                      title="Use my current location"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCity(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setInputCity(city);
                  setIsEditingCity(true);
                }}
                className="inline-flex items-center space-x-1.5 group text-slate-800 hover:text-blue-600 transition-colors font-medium cursor-pointer"
                title="Click to change city"
              >
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-slate-900 group-hover:underline decoration-blue-400 underline-offset-2">
                  {city}
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 border border-slate-200">
                  Change
                </span>
              </button>
            )}

            <span className="text-slate-300">|</span>

            <span className="text-slate-500 text-xs sm:text-sm">
              Updated {updatedTime || 'just now'}
            </span>
          </div>
        </div>

        {/* Right Status Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide shadow-xs transition-colors ${statusClasses}`}
          >
            <StatusIcon className="w-4 h-4 flex-shrink-0" />
            <span>{statusLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
