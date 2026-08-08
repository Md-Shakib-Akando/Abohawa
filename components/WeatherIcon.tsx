import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
} from 'lucide-react-native';
import { WeatherCode } from '../types/weather';

interface WeatherIconProps {
  code: WeatherCode;
  size?: number;
  color?: string;
}

export function WeatherIcon({ code, size = 24, color = '#FFFFFF' }: WeatherIconProps) {
  switch (code) {
    case 'Clear':
      return <Sun size={size} color={color || '#FFD93D'} />;
    case 'MainlyClear':
    case 'PartlyCloudy':
      return <CloudSun size={size} color={color || '#FFD93D'} />;
    case 'Overcast':
      return <Cloud size={size} color={color} />;
    case 'Fog':
      return <CloudFog size={size} color={color} />;
    case 'Drizzle':
      return <CloudDrizzle size={size} color={color || '#4D96FF'} />;
    case 'Rain':
    case 'HeavyRain':
      return <CloudRain size={size} color={color || '#4D96FF'} />;
    case 'Thunderstorm':
      return <CloudLightning size={size} color={color || '#FF6B6B'} />;
    case 'Snow':
      return <Snowflake size={size} color={color || '#6BCB77'} />;
    case 'Windy':
      return <Wind size={size} color={color} />;
    default:
      return <Sun size={size} color={color || '#FFD93D'} />;
  }
}
