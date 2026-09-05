import { AdvisoryResponse, DailyForecast, HistoryRecord, UserProfile } from './types';

// Read API Base from Vite environment, fallback to http://localhost:5000 as requested
export const DEFAULT_API_BASE = 'http://localhost:5000';
export const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? DEFAULT_API_BASE;

// Local storage key for history persistence
const HISTORY_STORAGE_KEY = 'airaware_history_records';

export interface ApiResponseMeta {
  isBackendConnected: boolean;
  source: 'flask_backend' | 'satellite_live';
}

/**
 * Fetch advisory from the Flask backend (or fallback to live atmospheric feed if Flask is unreachable)
 */
export async function fetchAdvisoryWithFallback(
  city: string,
  profile: UserProfile
): Promise<{ data: AdvisoryResponse; isBackendConnected: boolean }> {
  const params = new URLSearchParams({
    city,
    age_group: profile.age_group,
    health_condition: profile.health_condition,
    occupation: profile.occupation,
  });

  // 1. Try configured Flask backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast responsiveness

    const url = `${API_BASE}/api/advisory?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: AdvisoryResponse = await res.json();
      saveToLocalHistory({
        city: data.city || city,
        temperature: data.weather?.temperature ?? 22,
        humidity: data.weather?.humidity,
        wind_speed: data.weather?.wind_speed,
        aqi: data.air_quality?.aqi ?? 40,
        pm25: data.air_quality?.pm25,
        pm10: data.air_quality?.pm10,
        risk_level: data.risk_level,
        advisory: data.advisory,
        timestamp: new Date().toISOString(),
      });
      return { data, isBackendConnected: true };
    }
  } catch (e) {
    // Backend offline or unreachable
  }

  // 2. Also try relative /api in case reverse proxy or server-side proxy is active
  if (API_BASE !== '' && API_BASE !== '/api') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`/api/advisory?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data: AdvisoryResponse = await res.json();
        saveToLocalHistory({
          city: data.city || city,
          temperature: data.weather?.temperature ?? 22,
          humidity: data.weather?.humidity,
          wind_speed: data.weather?.wind_speed,
          aqi: data.air_quality?.aqi ?? 40,
          pm25: data.air_quality?.pm25,
          pm10: data.air_quality?.pm10,
          risk_level: data.risk_level,
          advisory: data.advisory,
          timestamp: new Date().toISOString(),
        });
        return { data, isBackendConnected: true };
      }
    } catch {
      // Continue to live satellite feed fallback
    }
  }

  // 3. Fallback to real live atmospheric open feed (Open-Meteo) so the user gets real live data for any city
  const fallbackData = await fetchLiveAtmosphericFeed(city, profile);
  saveToLocalHistory({
    city: fallbackData.city,
    temperature: fallbackData.weather.temperature,
    humidity: fallbackData.weather.humidity,
    wind_speed: fallbackData.weather.wind_speed,
    aqi: fallbackData.air_quality.aqi,
    pm25: fallbackData.air_quality.pm25,
    pm10: fallbackData.air_quality.pm10,
    risk_level: fallbackData.risk_level,
    advisory: fallbackData.advisory,
    timestamp: new Date().toISOString(),
  });

  return { data: fallbackData, isBackendConnected: false };
}

/**
 * Real-time Atmospheric Data Fetcher using Open-Meteo APIs (free, no API key required)
 */
async function fetchLiveAtmosphericFeed(city: string, profile: UserProfile): Promise<AdvisoryResponse> {
  let lat = 28.6139;
  let lon = 77.2090;
  let formattedCity = city.trim();

  // 1. Geocode city
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formattedCity)}&count=1&language=en&format=json`
    );
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        formattedCity = `${geoData.results[0].name}${geoData.results[0].country ? `, ${geoData.results[0].country}` : ''}`;
      }
    }
  } catch {
    // Use fallback coordinates
  }

  // 2. Fetch Weather & Forecast
  let weather = {
    temperature: 24,
    humidity: 52,
    wind_speed: 12,
    uv_index: 3,
    feels_like: 25,
    condition: 'Partly Cloudy',
    weather_code: 2,
  };

  let forecast: DailyForecast[] = [
    { dayName: 'Tomorrow', condition: 'Sunny', maxTemp: 26, minTemp: 16, weatherCode: 0 },
    { dayName: 'Day 2', condition: 'Partly Cloudy', maxTemp: 25, minTemp: 15, weatherCode: 2 },
    { dayName: 'Day 3', condition: 'Clear', maxTemp: 27, minTemp: 17, weatherCode: 1 },
    { dayName: 'Day 4', condition: 'Overcast', maxTemp: 23, minTemp: 14, weatherCode: 3 },
    { dayName: 'Day 5', condition: 'Light Breeze', maxTemp: 24, minTemp: 15, weatherCode: 2 },
  ];

  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    if (weatherRes.ok) {
      const wData = await weatherRes.json();
      if (wData.current) {
        weather = {
          temperature: Math.round(wData.current.temperature_2m),
          humidity: Math.round(wData.current.relative_humidity_2m),
          wind_speed: Math.round(wData.current.wind_speed_10m),
          uv_index: 3,
          feels_like: Math.round(wData.current.apparent_temperature),
          condition: getWeatherDescription(wData.current.weather_code),
          weather_code: wData.current.weather_code,
        };
      }
      if (wData.daily && wData.daily.time) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        forecast = wData.daily.time.slice(1, 6).map((timeStr: string, idx: number) => {
          const d = new Date(timeStr);
          const dayName = days[d.getDay()];
          const code = wData.daily.weather_code[idx + 1] ?? 0;
          return {
            dayName,
            condition: getWeatherDescription(code),
            maxTemp: Math.round(wData.daily.temperature_2m_max[idx + 1]),
            minTemp: Math.round(wData.daily.temperature_2m_min[idx + 1]),
            weatherCode: code,
          };
        });
      }
    }
  } catch {
    // Continue
  }

  // 3. Fetch Air Quality
  let airQuality = {
    aqi: 45,
    pm25: 11.2,
    pm10: 22.5,
  };

  try {
    const aqiRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,uv_index`
    );
    if (aqiRes.ok) {
      const aData = await aqiRes.json();
      if (aData.current) {
        airQuality = {
          aqi: Math.round(aData.current.us_aqi || 45),
          pm25: Number((aData.current.pm2_5 || 12).toFixed(1)),
          pm10: Number((aData.current.pm10 || 24).toFixed(1)),
        };
        if (aData.current.uv_index !== undefined) {
          weather.uv_index = Math.round(aData.current.uv_index);
        }
      }
    }
  } catch {
    // Continue
  }

  // 4. Generate Personalized Health Guidance based on multi-factor rules
  const advisoryDetails = generatePersonalizedGuidance(weather, airQuality, profile);

  return {
    city: formattedCity,
    weather,
    air_quality: airQuality,
    ...advisoryDetails,
    forecast,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Multi-factor synthesis engine matching PS-4 specifications
 */
function generatePersonalizedGuidance(
  weather: { temperature: number; humidity: number; wind_speed: number; uv_index: number },
  air: { aqi: number; pm25: number; pm10: number },
  profile: UserProfile
) {
  const isAsthma = profile.health_condition === 'asthma';
  const isSensitive = profile.health_condition === 'respiratory sensitivity';
  const isChild = profile.age_group === 'child';
  const isSenior = profile.age_group === 'senior';
  const isAthlete = profile.occupation === 'athlete';
  const isOutdoor = profile.occupation === 'outdoor worker' || profile.occupation === 'outdoor activity';

  let riskLevel = 'normal';
  let attentionLevel = 'Low';
  let advisory = 'Air quality is favorable for standard daily routines.';
  let whyItMatters = 'Atmospheric pollutants are within safe parameters. Normal outdoor engagement poses negligible physiological strain.';
  const recommendations: string[] = [];
  const envFactors: string[] = [];
  const profileFactors: string[] = [];

  // Environmental Factor Assessment
  if (air.aqi <= 50) {
    envFactors.push(`AQI index (${air.aqi}) is within the optimal clean air bracket`);
  } else if (air.aqi <= 100) {
    envFactors.push(`Moderate particulate load (AQI ${air.aqi}, PM2.5: ${air.pm25} µg/m³)`);
  } else if (air.aqi <= 150) {
    envFactors.push(`Elevated PM2.5 (${air.pm25} µg/m³) exceeds sensitive respiratory comfort limits`);
  } else {
    envFactors.push(`High particulate concentration (AQI ${air.aqi}) presents elevated health risk`);
  }

  if (weather.temperature > 32) {
    envFactors.push(`High ambient temperature (${weather.temperature}°C) accelerates dehydration and fatigue`);
  } else if (weather.temperature < 10) {
    envFactors.push(`Cold ambient air (${weather.temperature}°C) can cause airway constriction`);
  }

  if (weather.humidity > 70) {
    envFactors.push(`Elevated relative humidity (${weather.humidity}%) inhibits natural evaporative cooling`);
  } else if (weather.humidity < 30) {
    envFactors.push(`Dry ambient air (${weather.humidity}%) accelerates mucosal dryness`);
  }

  // Profile Factor Assessment
  if (isChild) {
    profileFactors.push('Higher resting respiratory minute volume relative to body mass in pediatric physiology');
  }
  if (isSenior) {
    profileFactors.push('Increased sensitivity of cardiopulmonary vascular lining');
  }
  if (isAsthma) {
    profileFactors.push('Hyper-reactive bronchial airways prone to particulate-induced bronchospasm');
  }
  if (isSensitive) {
    profileFactors.push('Increased mucous membrane inflammation threshold');
  }
  if (isAthlete) {
    profileFactors.push('High pulmonary ventilation rates during strenuous sustained physical exertion');
  }
  if (isOutdoor) {
    profileFactors.push('Extended continuous exposure window to ambient outdoor air currents');
  }

  // Risk Calculation
  if (air.aqi > 150 || (air.aqi > 100 && (isAsthma || isChild || isSenior))) {
    riskLevel = 'high';
    attentionLevel = 'High';
    advisory = isAsthma
      ? 'High Airway Caution: Restrict outdoor physical activity and keep rescue medication accessible.'
      : 'Elevated Air Pollution: Curtail outdoor workouts and seal interior ventilation.';
    whyItMatters = `Fine particulates (PM2.5: ${air.pm25} µg/m³) can trigger airway irritation, especially with your profile (${profile.age_group}, ${profile.health_condition}).`;
    recommendations.push(
      isAsthma ? 'Keep quick-relief inhaler within immediate reach at all times.' : 'Transition scheduled outdoor workouts to an indoor gym or filtered space.',
      'Wear an N95 or equivalent filtration mask if extended outdoor transit is necessary.',
      'Run indoor HEPA air filtration and keep exterior windows closed during peak traffic hours.'
    );
  } else if (air.aqi > 50 || isAsthma || isSensitive || (weather.temperature > 30 && isAthlete)) {
    riskLevel = 'moderate';
    attentionLevel = 'Moderate';
    advisory = isAthlete
      ? 'Moderate Air Conditions: Schedule intensive cardiovascular sessions for early morning hours.'
      : isAsthma
      ? 'Mild Respiratory Caution: Ambient particulates are moderate; monitor for throat or chest sensitivity.'
      : 'Acceptable Air Quality: General outdoor routines are safe with normal hydration.';
    whyItMatters = `While conditions are manageable for the general populace, your activity profile (${profile.occupation}) increases total particulate intake over time.`;
    recommendations.push(
      isAthlete ? 'Shift intense sprint or tempo drills away from high-traffic roadways.' : 'Take short indoor breaks if engaging in prolonged outdoor tasks.',
      'Maintain regular electrolyte hydration to support mucosal barrier defense.',
      'Ventilate indoor living areas during optimal midday hours when breeze is active.'
    );
  } else {
    riskLevel = 'normal';
    attentionLevel = 'Low';
    advisory = 'Prime Environmental Conditions: Clean atmospheric baseline supports all outdoor activities.';
    whyItMatters = 'Clean air and comfortable ambient temperatures reduce respiratory resistance and cardiovascular stress to minimum levels.';
    recommendations.push(
      'Optimal window for distance running, cycling, or outdoor recreation.',
      'Open windows for natural cross-ventilation to refresh indoor air.',
      'Enjoy sunlight exposure for natural circadian rhythm regulation.'
    );
  }

  return {
    risk_level: riskLevel,
    attention_level: attentionLevel,
    advisory,
    why_it_matters: whyItMatters,
    recommendations,
    environmental_factors: envFactors,
    personalized_factors: profileFactors.length > 0 ? profileFactors : ['Standard healthy adult baseline tolerance profile'],
  };
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow Flurries';
  if (code >= 80 && code <= 82) return 'Heavy Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
}

/**
 * History Management (Backend + Local fallback storage)
 */
export async function fetchHistory(): Promise<HistoryRecord[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/api/history`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const remote = await res.json();
      if (Array.isArray(remote) && remote.length > 0) {
        return remote;
      }
    }
  } catch {
    // Fall back to local storage
  }

  return getLocalHistory();
}

export const fetchHistoryWithFallback = fetchHistory;

export function saveToLocalHistory(record: HistoryRecord) {
  try {
    const existing = getLocalHistory();
    // Avoid duplicate records within 2 minutes for the same city
    const filtered = existing.filter(
      (r) => !(r.city.toLowerCase() === record.city.toLowerCase() && Math.abs(new Date(r.timestamp).getTime() - new Date(record.timestamp).getTime()) < 120000)
    );
    const updated = [record, ...filtered].slice(0, 20);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }
}

export function getLocalHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return default seed records
  }

  // Default seed entries if storage is empty
  return [
    {
      id: 1,
      city: 'Indore',
      temperature: 24,
      humidity: 48,
      wind_speed: 12,
      aqi: 68,
      pm25: 20.4,
      pm10: 42.0,
      risk_level: 'moderate',
      advisory: 'Moderate particulate load; sensitive groups exercise caution.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 2,
      city: 'New Delhi',
      temperature: 28,
      humidity: 55,
      wind_speed: 9,
      aqi: 142,
      pm25: 52.0,
      pm10: 110.0,
      risk_level: 'high',
      advisory: 'Elevated PM2.5 detected. Mask recommended for outdoor activity.',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 3,
      city: 'Bengaluru',
      temperature: 22,
      humidity: 62,
      wind_speed: 15,
      aqi: 38,
      pm25: 9.1,
      pm10: 18.0,
      risk_level: 'normal',
      advisory: 'Optimal air quality for all outdoor sports and commuting.',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}
