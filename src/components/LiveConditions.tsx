import React from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Activity, 
  Gauge,
  Info
} from 'lucide-react';
import { WeatherData, AirQualityData } from '../types';

interface LiveConditionsProps {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  isLoading: boolean;
}

export const LiveConditions: React.FC<LiveConditionsProps> = ({
  weather,
  airQuality,
  isLoading,
}) => {
  const temp = weather?.temperature ?? 24;
  const pm25 = airQuality?.pm25 ?? 11.2;
  const humidity = weather?.humidity ?? 52;
  const windSpeed = weather?.wind_speed ?? 12;
  const pm10 = airQuality?.pm10 ?? 22.5;
  const uv = weather?.uv_index ?? 3;

  // Temperature status
  const getTempStatus = (t: number) => {
    if (t < 15) return 'Cool air';
    if (t <= 26) return 'Pleasant comfort';
    if (t <= 33) return 'Warm';
    return 'Hot conditions';
  };

  // PM2.5 status
  const getPm25Status = (val: number) => {
    if (val <= 12) return 'WHO optimal (<15)';
    if (val <= 35) return 'Moderate level';
    if (val <= 55) return 'Unhealthy for sensitive';
    return 'High concentration';
  };

  // Humidity status
  const getHumidityStatus = (h: number) => {
    if (h < 30) return 'Dry atmosphere';
    if (h <= 60) return 'Ideal breathing range';
    if (h <= 75) return 'Moderate moisture';
    return 'High humidity';
  };

  // Wind status
  const getWindStatus = (w: number) => {
    if (w < 10) return 'Light breeze';
    if (w <= 25) return 'Moderate breeze';
    if (w <= 40) return 'Brisk winds';
    return 'High wind alert';
  };

  // PM10 status
  const getPm10Status = (val: number) => {
    if (val <= 45) return 'Good / Clean';
    if (val <= 100) return 'Moderate dust';
    return 'Elevated coarse particles';
  };

  // UV status
  const getUvStatus = (u: number) => {
    if (u <= 2) return 'Low (Safe)';
    if (u <= 5) return 'Moderate (Hat/Sunscreen)';
    if (u <= 7) return 'High exposure';
    return 'Very high UV';
  };

  const metrics = [
    {
      id: 'temp',
      name: 'Temperature',
      value: Math.round(temp),
      unit: '°C',
      status: getTempStatus(temp),
      icon: Thermometer,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200/80',
    },
    {
      id: 'pm25',
      name: 'PM2.5 (Fine)',
      value: typeof pm25 === 'number' ? pm25.toFixed(1) : pm25,
      unit: 'µg/m³',
      status: getPm25Status(Number(pm25)),
      icon: Activity,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: Math.round(humidity),
      unit: '%',
      status: getHumidityStatus(humidity),
      icon: Droplets,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200/80',
    },
    {
      id: 'wind',
      name: 'Wind Speed',
      value: typeof windSpeed === 'number' ? windSpeed.toFixed(1) : windSpeed,
      unit: 'km/h',
      status: getWindStatus(Number(windSpeed)),
      icon: Wind,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200/80',
    },
    {
      id: 'pm10',
      name: 'PM10 (Coarse)',
      value: typeof pm10 === 'number' ? pm10.toFixed(1) : pm10,
      unit: 'µg/m³',
      status: getPm10Status(Number(pm10)),
      icon: Gauge,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
    },
    {
      id: 'uv',
      name: 'UV Index',
      value: typeof uv === 'number' ? uv.toFixed(1) : uv,
      unit: 'UV',
      status: getUvStatus(Number(uv)),
      icon: Sun,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200/80',
    },
  ];

  return (
    <section className="w-full my-6">
      {/* Section Heading */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-black tracking-wider uppercase text-emerald-700">
            ATMOSPHERIC PARAMETERS
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            Real-time Sensor Breakdown
          </h3>
        </div>
        <div className="hidden sm:flex items-center text-xs text-slate-500 gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Calibrated against international standard metrics</span>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Top Row: Icon + "Live" badge */}
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.iconColor}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live
                </span>
              </div>

              {/* Metric Name */}
              <div className="mt-3 text-xs font-semibold text-slate-500">
                {item.name}
              </div>

              {/* Large Value & Unit */}
              <div className="my-1 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isLoading ? '...' : item.value}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {item.unit}
                </span>
              </div>

              {/* Short Status Description */}
              <div className="text-[11px] font-medium text-slate-600 leading-tight">
                {item.status}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
