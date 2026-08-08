import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles, Umbrella, Sun, Activity, Zap, Moon } from 'lucide-react-native';
import { WeatherData } from '../types/weather';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface InsightCardProps {
  weather: WeatherData;
}

export function InsightCard({ weather }: InsightCardProps) {
  const { language, unitSystem } = useAppStore();
  const t = TRANSLATIONS[language];

  // Determine smart insight text & icon
  let insightText = '';
  let IconComponent = Sparkles;
  let accentColor = '#FFD93D';

  const rainHour = weather.hourly.find(h => h.pop > 50);

  if (rainHour) {
    insightText = t.insights.rainSoon.replace('{time}', rainHour.time);
    IconComponent = Umbrella;
    accentColor = '#4D96FF';
  } else if (weather.uvIndex >= 6) {
    insightText = t.insights.highUv.replace('{uv}', weather.uvIndex.toString());
    IconComponent = Sun;
    accentColor = '#FF9800';
  } else if (weather.windSpeedKmh > 35) {
    insightText = t.insights.severeWarning.replace('{wind}', weather.windSpeedKmh.toString());
    IconComponent = Zap;
    accentColor = '#FF6B6B';
  } else if (weather.tempC >= 18 && weather.tempC <= 26 && weather.windSpeedKmh < 20) {
    const tempDisp = unitSystem === 'metric' ? weather.tempC : weather.tempF;
    insightText = t.insights.greatForRun.replace('{temp}', tempDisp.toString());
    IconComponent = Activity;
    accentColor = '#6BCB77';
  } else {
    const isNight = new Date().getHours() < 6 || new Date().getHours() > 19;
    if (isNight) {
      insightText = t.insights.clearSky;
      IconComponent = Moon;
      accentColor = '#A0AEC0';
    } else {
      const minDisp = unitSystem === 'metric' ? weather.tempMinC : weather.tempMinF;
      insightText = t.insights.chillyNight.replace('{temp}', minDisp.toString());
      IconComponent = Sparkles;
      accentColor = '#FFD93D';
    }
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}25` }]}>
          <IconComponent size={20} color={accentColor} />
        </View>
        <Text style={styles.titleText}>{t.sections.insights}</Text>
      </View>

      <Text style={styles.bodyText}>{insightText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    marginHorizontal: THEME.spacing.md,
    marginVertical: THEME.spacing.xs,
    padding: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontWeight: '400',
  },
});
