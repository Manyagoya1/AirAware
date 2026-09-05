import React from 'react';
import { History as HistoryIcon, Thermometer, ChevronRight, MapPin, Clock } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistorySectionProps {
  history: HistoryRecord[];
  isLoading: boolean;
  onSelectRecord?: (record: HistoryRecord) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  isLoading,
  onSelectRecord,
}) => {
  // AQI Category Helper
  const getCategoryInfo = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (aqi <= 100) return { label: 'Moderate', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (aqi <= 150) return { label: 'Sensitive', badge: 'bg-orange-50 text-orange-800 border-orange-200' };
    return { label: 'Unhealthy', badge: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  // Format date and time
  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) {
        return { date: 'Today', time: 'Recent' };
      }
      const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return { date, time };
    } catch {
      return { date: 'Today', time: 'Recent' };
    }
  };

  const recordsToDisplay = history.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <HistoryIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700">
                AUDIT HISTORY
              </span>
              <h3 className="text-xs text-slate-500 font-medium">Recent Environmental Logs</h3>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {recordsToDisplay.length} entries
          </span>
        </div>

        {/* Content List */}
        <div className="mt-3">
          {isLoading && history.length === 0 ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recordsToDisplay.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <HistoryIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No recorded history yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Advisories will automatically record as you monitor different cities.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recordsToDisplay.map((record, index) => {
                const { date, time } = formatTimestamp(record.timestamp);
                const category = getCategoryInfo(record.aqi);

                return (
                  <div
                    key={record.id || index}
                    onClick={() => onSelectRecord?.(record)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/90 px-2 rounded-xl transition-all cursor-pointer group"
                  >
                    {/* Date, Location, Metrics */}
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex flex-col items-center justify-center text-[10px] font-bold group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                        <span>{date.split(' ')[0]}</span>
                        <span className="text-[9px] text-slate-400">{date.split(' ')[1]}</span>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{record.city}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({time})
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5 font-medium">
                            <Thermometer className="w-3 h-3 text-amber-500" />
                            {Math.round(record.temperature)}°C
                          </span>
                          {record.pm25 !== undefined && (
                            <span className="text-slate-400">PM2.5: {record.pm25}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AQI Badge */}
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          {record.aqi} <span className="text-[10px] font-semibold text-slate-400">AQI</span>
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${category.badge}`}>
                          {category.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors hidden sm:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any entry to inspect conditions</span>
        <span>Persistent storage</span>
      </div>
    </div>
  );
};
