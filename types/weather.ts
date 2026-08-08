export type WeatherCode = 
  | 'Clear' 
  | 'MainlyClear' 
  | 'PartlyCloudy' 
  | 'Overcast' 
  | 'Fog' 
  | 'Drizzle' 
  | 'Rain' 
  | 'HeavyRain' 
  | 'Thunderstorm' 
  | 'Snow' 
  | 'Windy';

export interface HourlyForecast {
  time: string; // ISO or "14:00"
  tempC: number;
  tempF: number;
  conditionCode: WeatherCode;
  conditionText: string;
  pop: number; // probability of precipitation 0-100%
  precipMm: number;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string; // "2026-08-01"
  dayName: string; // "Mon", "Tue"
  conditionCode: WeatherCode;
  conditionText: string;
  maxTempC: number;
  minTempC: number;
  maxTempF: number;
  minTempF: number;
  pop: number;
  uvMax: number;
  sunrise: string; // "05:32"
  sunset: string; // "18:45"
}

export interface AirQuality {
  aqi: number; // 0-500
  label: string; // "Good", "Moderate", etc.
  color: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  isCurrentLocation?: boolean;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  tempMinC: number;
  tempMaxC: number;
  tempMinF: number;
  tempMaxF: number;
  conditionCode: WeatherCode;
  conditionText: string;
  humidity: number;
  windSpeedKmh: number;
  windSpeedMph: number;
  windDirectionDeg: number;
  pressureHpa: number;
  visibilityKm: number;
  dewPointC: number;
  uvIndex: number;
  aqi: AirQuality;
  sunrise: string;
  sunset: string;
  daylightHours: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alert?: {
    title: string;
    description: string;
    severity: 'warning' | 'watch' | 'advisory';
  };
  lastUpdated: number; // Epoch timestamp ms
}

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  isCurrentLocation?: boolean;
}
