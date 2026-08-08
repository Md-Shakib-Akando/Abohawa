import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapPin, Trash2, CheckCircle2 } from 'lucide-react-native';
import { CityLocation } from '../types/weather';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcon } from './WeatherIcon';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface CityCardProps {
  city: CityLocation;
  isActive: boolean;
  onSelect: (city: CityLocation) => void;
  onDelete?: (cityId: string) => void;
}

export function CityCard({ city, isActive, onSelect, onDelete }: CityCardProps) {
  const { unitSystem, language } = useAppStore();
  const t = TRANSLATIONS[language];

  const { data: weather } = useWeather(city.name, city.lat, city.lon, city.id);

  const temp = weather
    ? (unitSystem === 'metric' ? weather.tempC : weather.tempF)
    : '--';

  return (
    <TouchableOpacity
      onPress={() => onSelect(city)}
      activeOpacity={0.8}
      style={[
        styles.cardContainer,
        isActive && styles.activeCard,
      ]}
    >
      <View style={styles.leftCol}>
        <View style={styles.nameRow}>
          {city.isCurrentLocation ? (
            <MapPin size={18} color="#56CCF2" style={styles.pinIcon} />
          ) : null}
          <Text style={styles.cityName}>{city.name}</Text>
          {isActive && <CheckCircle2 size={16} color="#6BCB77" style={styles.checkIcon} />}
        </View>

        <Text style={styles.countryText}>{city.country}</Text>

        {weather && (
          <Text style={styles.conditionSubText}>
            {t.weatherConditions[weather.conditionCode] || weather.conditionText}
          </Text>
        )}
      </View>

      <View style={styles.rightCol}>
        <View style={styles.tempRow}>
          {weather && <WeatherIcon code={weather.conditionCode} size={28} />}
          <Text style={styles.tempText}>{temp}°</Text>
        </View>

        {onDelete && !city.isCurrentLocation && (
          <TouchableOpacity
            onPress={() => onDelete(city.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={16} color="rgba(255, 107, 107, 0.8)" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    padding: THEME.spacing.md,
    marginBottom: 12,
  },
  activeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: '#56CCF2',
    borderWidth: 1.5,
  },
  leftCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 6,
  },
  checkIcon: {
    marginLeft: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countryText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  conditionSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  deleteBtn: {
    marginTop: 10,
    padding: 4,
  },
});
