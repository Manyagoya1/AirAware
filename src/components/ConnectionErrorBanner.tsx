import React from 'react';
import { AlertCircle, RefreshCw, Terminal, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ConnectionErrorBannerProps {
  errorMessage?: string;
  onRetry: () => void;
  isLoading: boolean;
}

export const ConnectionErrorBanner: React.FC<ConnectionErrorBannerProps> = ({
  errorMessage,
  onRetry,
  isLoading,
}) => {
  return (
    <div className="w-full my-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 p-4 sm:p-5 text-amber-950 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Flask Backend (Port 5000) is Offline · Active on Live Atmospheric Feed
            </h4>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              AirAware is currently streaming live atmospheric satellite data so you can test all features. To connect your local Flask server, run <code className="bg-amber-100/90 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">python app.py</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Check Flask (5000)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
