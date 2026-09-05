export type AgeGroup = 'child' | 'adult' | 'senior';
export type HealthCondition = 'none' | 'asthma' | 'respiratory sensitivity';
export type Occupation = 'indoor worker' | 'outdoor worker' | 'athlete' | 'outdoor activity';

export interface UserProfile {
  name: string;
  age_group: AgeGroup;
  health_condition: HealthCondition;
  occupation: Occupation;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  uv_index: number;
  feels_like?: number;
  condition?: string;
  weather_code?: number;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
}

export interface AdvisoryResponse {
  city: string;
  weather: WeatherData;
  air_quality: AirQualityData;
  risk_level: string; // 'normal' | 'moderate' | 'high'
  attention_level: string; // 'Low' | 'Moderate' | 'High' | 'Very High'
  advisory: string;
  why_it_matters: string;
  recommendations: string[];
  environmental_factors: string[];
  personalized_factors: string[];
  // Optional forecast if returned or enriched
  forecast?: DailyForecast[];
  timestamp?: string;
}

export interface DailyForecast {
  dayName: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

export interface HistoryRecord {
  id?: number;
  city: string;
  temperature: number;
  humidity?: number;
  wind_speed?: number;
  aqi: number;
  pm25?: number;
  pm10?: number;
  risk_level?: string;
  advisory?: string;
  timestamp: string;
}
