export interface GradientTheme {
  name: string;
  colors: [string, string, string];
  accent: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subtextColor: string;
  statusBarStyle: 'light' | 'dark';
}

export const WEATHER_GRADIENTS: Record<string, GradientTheme> = {
  frigid: {
    name: 'Frigid (< 0°C)',
    colors: ['#0A192F', '#1E3A8A', '#3B82F6'],
    accent: '#A5F3FC',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(165, 243, 252, 0.3)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    statusBarStyle: 'light',
  },
  cold: {
    name: 'Cold (0 - 12°C)',
    colors: ['#0F2027', '#203A43', '#2C5364'],
    accent: '#38BDF8',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.18)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    statusBarStyle: 'light',
  },
  mild: {
    name: 'Mild (13 - 23°C)',
    colors: ['#065F46', '#047857', '#10B981'],
    accent: '#6EE7B7',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    statusBarStyle: 'light',
  },
  warm: {
    name: 'Warm (24 - 32°C)',
    colors: ['#1E1B4B', '#4338CA', '#38BDF8'],
    accent: '#FDE047',
    cardBg: 'rgba(255, 255, 255, 0.14)',
    cardBorder: 'rgba(255, 255, 255, 0.22)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    statusBarStyle: 'light',
  },
  hot: {
    name: 'Extreme Heat (≥ 33°C)',
    colors: ['#4C0519', '#9F1239', '#F43F5E'],
    accent: '#FDE047',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(254, 240, 138, 0.35)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    statusBarStyle: 'light',
  },
  dawn: {
    name: 'Dawn',
    colors: ['#2C1B4D', '#7B4397', '#DC2430'],
    accent: '#FFB347',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    statusBarStyle: 'light',
  },
  dusk: {
    name: 'Dusk',
    colors: ['#141E30', '#243B55', '#E15FE6'],
    accent: '#FF9966',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    statusBarStyle: 'light',
  },
  nightClear: {
    name: 'Night Clear',
    colors: ['#0B132B', '#1C2541', '#3A506B'],
    accent: '#64DFDF',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.65)',
    statusBarStyle: 'light',
  },
  nightCold: {
    name: 'Night Cold',
    colors: ['#030712', '#0B132B', '#1E293B'],
    accent: '#38BDF8',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.65)',
    statusBarStyle: 'light',
  },
  nightWarm: {
    name: 'Night Warm',
    colors: ['#1A0C27', '#2A1435', '#1C2541'],
    accent: '#FDE047',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.65)',
    statusBarStyle: 'light',
  },
  nightStorm: {
    name: 'Night Storm',
    colors: ['#0A0E17', '#1A1C29', '#2E3244'],
    accent: '#FF6B6B',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.65)',
    statusBarStyle: 'light',
  },
  rainy: {
    name: 'Rainy',
    colors: ['#0F172A', '#1E293B', '#334155'],
    accent: '#38BDF8',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.75)',
    statusBarStyle: 'light',
  },
  snowy: {
    name: 'Snowy',
    colors: ['#1E293B', '#334155', '#475569'],
    accent: '#E0F7FA',
    cardBg: 'rgba(255, 255, 255, 0.18)',
    cardBorder: 'rgba(255, 255, 255, 0.25)',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.8)',
    statusBarStyle: 'light',
  }
};

export function getThemeByTemperatureAndCondition(tempC?: number, conditionCode?: string): GradientTheme {
  const hour = new Date().getHours();
  // Night mode cutoff: 19:00 (7 PM) to 06:00 (6 AM) (Bypassed if conditionCode is 'Clear')
  const isNight = conditionCode === 'Clear' ? false : (hour < 6 || hour >= 19);

  // Weather overrides
  if (conditionCode === 'Rain' || conditionCode === 'HeavyRain' || conditionCode === 'Drizzle') {
    return WEATHER_GRADIENTS.rainy;
  }
  if (conditionCode === 'Thunderstorm') {
    return WEATHER_GRADIENTS.nightStorm;
  }
  if (conditionCode === 'Snow') {
    return WEATHER_GRADIENTS.snowy;
  }

  // Night Mode logic (until 3 AM)
  if (isNight) {
    if (tempC !== undefined && tempC < 15) {
      return WEATHER_GRADIENTS.nightCold;
    }
    if (tempC !== undefined && tempC >= 28) {
      return WEATHER_GRADIENTS.nightWarm;
    }
    return WEATHER_GRADIENTS.nightClear;
  }

  // Day Time logic: Temperature dependent (3 AM to 7 PM)
  if (tempC !== undefined) {
    if (tempC < 0) return WEATHER_GRADIENTS.frigid;
    if (tempC <= 12) return WEATHER_GRADIENTS.cold;
    if (tempC <= 23) return WEATHER_GRADIENTS.mild;
    if (tempC <= 32) return WEATHER_GRADIENTS.warm;
    return WEATHER_GRADIENTS.hot;
  }

  if (hour >= 3 && hour < 8) return WEATHER_GRADIENTS.dawn;
  if (hour >= 16 && hour < 19) return WEATHER_GRADIENTS.dusk;
  return WEATHER_GRADIENTS.warm;
}

export const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#4CAF50', desc: 'Air quality is satisfactory' },
  { max: 100, label: 'Moderate', color: '#FFC107', desc: 'Acceptable air quality' },
  { max: 150, label: 'Unhealthy for Sensitive', color: '#FF9800', desc: 'Sensitive groups may experience health effects' },
  { max: 200, label: 'Unhealthy', color: '#F44336', desc: 'Everyone may begin to experience health effects' },
  { max: 300, label: 'Very Unhealthy', color: '#9C27B0', desc: 'Health alert: risk for everyone' },
  { max: 500, label: 'Hazardous', color: '#880E4F', desc: 'Health warning of emergency conditions' }
];

export const UV_LEVELS = [
  { max: 2, label: 'Low', color: '#4CAF50', tip: 'No protection required.' },
  { max: 5, label: 'Moderate', color: '#FFC107', tip: 'Wear sunglasses & SPF 30+.' },
  { max: 7, label: 'High', color: '#FF9800', tip: 'Cover up, stay in shade near midday.' },
  { max: 10, label: 'Very High', color: '#F44336', tip: 'Extra protection needed. Avoid sun 11 AM - 4 PM.' },
  { max: 15, label: 'Extreme', color: '#9C27B0', tip: 'Take all precautions. Unprotected skin burns fast.' }
];

export const APP_COLORS = {
  ink: '#0A0E14',
  surface: '#F5F7FA',
  white: '#FFFFFF',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  accentRain: '#4D96FF',
  accentSun: '#FFD93D',
  accentStorm: '#FF6B6B',
  accentSnow: '#6BCB77',
  navBg: 'rgba(10, 14, 20, 0.85)',
};
