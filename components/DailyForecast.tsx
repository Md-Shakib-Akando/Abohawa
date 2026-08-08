import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Droplets } from 'lucide-react-native';
import { DailyForecast as DailyItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface DailyForecastProps {
  daily: DailyItem[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const { unitSystem, language } = useAppStore();
  const t = TRANSLATIONS[language];

  if (!daily || daily.length === 0) return null;

  // Calculate global min and max for range bar proportion
  const allMins = daily.map(d => unitSystem === 'metric' ? d.minTempC : d.minTempF);
  const allMaxs = daily.map(d => unitSystem === 'metric' ? d.maxTempC : d.maxTempF);
  const minGlobal = Math.min(...allMins);
  const maxGlobal = Math.max(...allMaxs);
  const rangeGlobal = Math.max(1, maxGlobal - minGlobal);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionTitle}>{t.sections.daily}</Text>

      {daily.slice(0, 7).map((item, idx) => {
        const minTemp = unitSystem === 'metric' ? item.minTempC : item.minTempF;
        const maxTemp = unitSystem === 'metric' ? item.maxTempC : item.maxTempF;

        // Position percentage for range bar
        const leftPercent = ((minTemp - minGlobal) / rangeGlobal) * 100;
        const widthPercent = Math.max(15, ((maxTemp - minTemp) / rangeGlobal) * 100);

        return (
          <View key={idx} style={styles.dayRow}>
            {/* Day Name */}
            <Text style={styles.dayNameText}>{item.dayName}</Text>

            {/* Icon + Pop */}
            <View style={styles.iconCol}>
              <WeatherIcon code={item.conditionCode} size={22} />
              {item.pop > 20 && (
                <View style={styles.popContainer}>
                  <Droplets size={10} color="#4D96FF" />
                  <Text style={styles.popText}>{item.pop}%</Text>
                </View>
              )}
            </View>

            {/* Temp Range Bar */}
            <Text style={styles.minTempText}>{minTemp}°</Text>
            
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.maxTempText}>{maxTemp}°</Text>
          </View>
        );
      })}
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
    marginVertical: THEME.spacing.sm,
    padding: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: THEME.spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dayNameText: {
    width: 60,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconCol: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 75,
  },
  popContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  popText: {
    fontSize: 10,
    color: '#4D96FF',
    fontWeight: '600',
    marginLeft: 2,
  },
  minTempText: {
    width: 32,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    marginRight: 8,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 4,
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFD93D',
    borderRadius: 3,
  },
  maxTempText: {
    width: 32,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
