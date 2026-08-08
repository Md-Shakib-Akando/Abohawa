import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Droplets, Wind, Gauge, Eye } from 'lucide-react-native';
import { WeatherData } from '../types/weather';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface QuickStatsRowProps {
  weather: WeatherData;
}

export function QuickStatsRow({ weather }: QuickStatsRowProps) {
  const { unitSystem, language } = useAppStore();
  const t = TRANSLATIONS[language];

  const windSpeed = unitSystem === 'metric'
    ? `${weather.windSpeedKmh} ${t.units.kmh}`
    : `${weather.windSpeedMph} ${t.units.mph}`;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.sections.quickStats}</Text>

      <View style={styles.grid}>
        {/* Humidity */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Droplets size={18} color="#4D96FF" />
            <Text style={styles.statLabel}>{t.stats.humidity}</Text>
          </View>
          <Text style={styles.statVal}>{weather.humidity}%</Text>
          <Text style={styles.statSub}>Dew point {weather.dewPointC}°C</Text>
        </View>

        {/* Wind Speed */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Wind size={18} color="#56CCF2" />
            <Text style={styles.statLabel}>{t.stats.wind}</Text>
          </View>
          <Text style={styles.statVal}>{windSpeed}</Text>
          <Text style={styles.statSub}>Dir {weather.windDirectionDeg}°</Text>
        </View>

        {/* Pressure */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Gauge size={18} color="#FF9800" />
            <Text style={styles.statLabel}>{t.stats.pressure}</Text>
          </View>
          <Text style={styles.statVal}>{weather.pressureHpa} hPa</Text>
          <Text style={styles.statSub}>Normal</Text>
        </View>

        {/* Visibility */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <Eye size={18} color="#6BCB77" />
            <Text style={styles.statLabel}>{t.stats.visibility}</Text>
          </View>
          <Text style={styles.statVal}>{weather.visibilityKm} km</Text>
          <Text style={styles.statSub}>Clear view</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: THEME.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 6,
    fontWeight: '500',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 4,
  },
});
