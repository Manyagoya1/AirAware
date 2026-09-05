import React from 'react';
import { Wind, RefreshCw, User, SlidersHorizontal, Radio, Wifi, WifiOff } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onOpenProfile,
  onRefresh,
  isLoading,
  isBackendConnected,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Wind className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                AirAware
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                PS-4 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Personalized Weather & AQI Health Advisory
            </p>
          </div>
        </div>

        {/* Center/Right Status & User Profile */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Backend Connection Status Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-50 border-slate-200/80">
            {isBackendConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-700 font-semibold">Flask API (5000)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-slate-600">Live Satellite Feed</span>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Refresh weather & AQI data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* User Profile Pill Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 group cursor-pointer shadow-2xs"
            title="Click to customize age, health condition & activity"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <span>{userProfile.name || 'Alex'}</span>
                <span className="text-[10px] font-medium text-slate-400 capitalize hidden md:inline">
                  ({userProfile.age_group})
                </span>
              </div>
              <div className="text-[11px] text-slate-500 capitalize truncate max-w-[110px] hidden sm:block">
                {userProfile.health_condition !== 'none' ? userProfile.health_condition : userProfile.occupation}
              </div>
            </div>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
