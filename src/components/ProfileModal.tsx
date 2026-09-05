import React, { useState } from 'react';
import { X, User, HeartPulse, Briefcase, Sparkles, Check, Info } from 'lucide-react';
import { UserProfile, AgeGroup, HealthCondition, Occupation } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  isLoading,
}) => {
  const [name, setName] = useState(currentProfile.name || 'Alex');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(currentProfile.age_group || 'adult');
  const [healthCondition, setHealthCondition] = useState<HealthCondition>(
    currentProfile.health_condition || 'none'
  );
  const [occupation, setOccupation] = useState<Occupation>(
    currentProfile.occupation || 'indoor worker'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Alex',
      age_group: ageGroup,
      health_condition: healthCondition,
      occupation: occupation,
    });
  };

  const ageOptions: { value: AgeGroup; label: string; desc: string }[] = [
    { value: 'child', label: 'Child', desc: 'Higher lung ventilation volume relative to weight' },
    { value: 'adult', label: 'Adult', desc: 'Standard environmental exposure baseline' },
    { value: 'senior', label: 'Senior', desc: 'Heightened cardiovascular & vascular sensitivity' },
  ];

  const conditionOptions: { value: HealthCondition; label: string; desc: string }[] = [
    { value: 'none', label: 'None (Healthy baseline)', desc: 'No chronic respiratory or airway conditions' },
    { value: 'asthma', label: 'Asthma', desc: 'Hyper-reactive airways susceptible to spasm under fine dust' },
    { value: 'respiratory sensitivity', label: 'Respiratory sensitivity', desc: 'Prone to allergies, bronchitis, or mucosal irritation' },
  ];

  const occupationOptions: { value: Occupation; label: string; desc: string }[] = [
    { value: 'indoor worker', label: 'Indoor worker', desc: 'Office or home with filtered ventilation' },
    { value: 'outdoor worker', label: 'Outdoor worker', desc: 'Continuous 6-8+ hour ambient air exposure' },
    { value: 'athlete', label: 'Athlete / Runner', desc: 'High lung ventilation during heavy exertion' },
    { value: 'outdoor activity', label: 'Outdoor recreation', desc: 'Recreational jogging, cycling, or parks' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">User Health Profile</h3>
              <p className="text-xs text-slate-500">Fine-tune personalized health sensitivity algorithms</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* User Name */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name or Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Manya"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
            />
          </div>

          {/* Age Group */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Age Group
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ageOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAgeGroup(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                    ageGroup === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>{opt.label}</span>
                    {ageGroup === opt.value && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] font-normal text-slate-500 block leading-tight">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Health Condition */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Health Condition
                </label>
              </div>
            </div>
            <div className="space-y-1.5">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHealthCondition(opt.value)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-bold cursor-pointer ${
                    healthCondition === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{opt.label}</div>
                    <div className="text-[11px] font-normal text-slate-500">{opt.desc}</div>
                  </div>
                  {healthCondition === opt.value && (
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Occupation / Daily Routine */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Occupation & Activity
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {occupationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOccupation(opt.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                    occupation === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span>{opt.label}</span>
                    {occupation === opt.value && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] font-normal text-slate-500 block leading-tight">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Update Profile & Advisory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
