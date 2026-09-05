import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroGreeting } from './components/HeroGreeting';
import { AqiHeroCard } from './components/AqiHeroCard';
import { AdvisoryCard } from './components/AdvisoryCard';
import { ExplainabilityCard } from './components/ExplainabilityCard';
import { LiveConditions } from './components/LiveConditions';
import { HistorySection } from './components/HistorySection';
import { ProfileModal } from './components/ProfileModal';
import { ConnectionErrorBanner } from './components/ConnectionErrorBanner';
import { fetchAdvisoryWithFallback, fetchHistory } from './api';
import { AdvisoryResponse, HistoryRecord, UserProfile, WeatherData, AirQualityData } from './types';
import { Info, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  age_group: 'adult',
  health_condition: 'asthma',
  occupation: 'athlete',
};

const POPULAR_CITIES = ['Indore', 'New Delhi', 'Mumbai', 'Bengaluru', 'London', 'New York'];

export default function App() {
  const [city, setCity] = useState<string>('Indore');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('airaware_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return DEFAULT_PROFILE;
  });

  const [advisoryData, setAdvisoryData] = useState<AdvisoryResponse | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [updatedTime, setUpdatedTime] = useState<string>('just now');

  // Load advisory data
  const loadData = useCallback(
    async (targetCity: string, profile: UserProfile) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { data, isBackendConnected: connected } = await fetchAdvisoryWithFallback(
          targetCity,
          profile
        );
        setAdvisoryData(data);
        setIsBackendConnected(connected);

        const now = new Date();
        setUpdatedTime(
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        );

        // Refresh history
        const histData = await fetchHistory();
        setHistory(histData);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load environmental data.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadData(city, userProfile);
  }, [city, userProfile, loadData]);

  // Handle City Change
  const handleCityChange = (newCity: string) => {
    if (!newCity.trim()) return;
    setCity(newCity.trim());
  };

  // Handle Profile Update
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('airaware_user_profile', JSON.stringify(newProfile));
    } catch {
      // Ignore
    }
    setIsProfileModalOpen(false);
  };

  // Geolocation trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          if (res.ok) {
            const data = await res.json();
            const detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.suburb ||
              data.address?.state ||
              'Current Area';
            if (detectedCity) {
              setCity(detectedCity);
              return;
            }
          }
        } catch {
          // Fallback
        }
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        alert('Could not access current location. Please enter city manually.');
      },
      { timeout: 8000 }
    );
  };

  // Select historical record
  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    if (record.city) {
      setCity(record.city);
    }
  };

  const defaultWeather: WeatherData = advisoryData?.weather || {
    temperature: 24,
    humidity: 50,
    wind_speed: 12.5,
    condition: 'Partly cloudy',
    uv_index: 3,
  };

  const defaultAirQuality: AirQualityData = advisoryData?.air_quality || {
    aqi: 42,
    pm25: 11.2,
    pm10: 24.5,
    o3: 42,
    no2: 15,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRefresh={() => loadData(city, userProfile)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Backend Connection Status Banner (shown if backend error or running standalone) */}
        {!isBackendConnected && (
          <ConnectionErrorBanner
            errorMessage={errorMessage ?? undefined}
            onRetry={() => loadData(city, userProfile)}
            isLoading={isLoading}
          />
        )}

        {/* Hero & Greeting Section */}
        <div className="space-y-3">
          <HeroGreeting
            userProfile={userProfile}
            city={city}
            onCityChange={handleCityChange}
            updatedTime={updatedTime}
            attentionLevel={advisoryData?.attention_level || 'Low'}
            riskLevel={advisoryData?.risk_level || 'normal'}
            isLoading={isLoading}
            onLocateMe={handleLocateMe}
          />

          {/* Quick City Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap pl-0.5">
              Quick locations:
            </span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCityChange(c)}
                className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap border ${
                  city.toLowerCase() === c.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Main Two-Column Core: AQI Card & Personalized Advisory Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Environmental Condition / AQI Card */}
          <div className="lg:col-span-6 flex flex-col">
            <AqiHeroCard
              city={city}
              weather={defaultWeather}
              airQuality={defaultAirQuality}
              aqiCategory={advisoryData?.aqi_category}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Personalized Health Advisory Card */}
          <div className="lg:col-span-6 flex flex-col">
            <AdvisoryCard
              advisoryData={advisoryData}
              userProfile={userProfile}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Live Conditions Section: 6 metric cards */}
        <LiveConditions
          weather={advisoryData?.weather || defaultWeather}
          airQuality={advisoryData?.air_quality || defaultAirQuality}
          isLoading={isLoading}
        />

        {/* Explainability & History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Explainability Card */}
          <div className="lg:col-span-7 flex flex-col">
            <ExplainabilityCard
              advisoryData={advisoryData}
              userProfile={userProfile}
              isLoading={isLoading}
            />
          </div>

          {/* History Section */}
          <div className="lg:col-span-5 flex flex-col">
            <HistorySection
              history={history}
              isLoading={isLoading}
              onSelectRecord={handleSelectHistoryRecord}
            />
          </div>
        </div>

        {/* Multi-Factor Architecture Badge */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  AirAware Multi-Factor Engine (PS-4)
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates AQI, PM2.5, PM10, temperature, humidity, and wind alongside your personalized health profile.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span>Edit profile</span>
            </button>
            <button
              type="button"
              onClick={() => loadData(city, userProfile)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Refresh data</span>
            </button>
          </div>
        </div>
      </main>

      {/* Clean Modern Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900">AirAware</span>
            <span>•</span>
            <span>Intelligent Environmental Health Companion</span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-slate-400 text-center sm:text-right">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mr-1" />
            <span>Advisories synthesize environmental metrics with user physiology for preventive guidance.</span>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        isLoading={isLoading}
      />
    </div>
  );
}
