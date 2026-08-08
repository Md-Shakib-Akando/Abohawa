import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Wind } from 'lucide-react-native';
import { AirQuality } from '../types/weather';
import { AQI_LEVELS } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface AqiCardProps {
  aqiData: AirQuality;
}

export function AqiCard({ aqiData }: AqiCardProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  const levelObj = AQI_LEVELS.find(l => aqiData.aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
  const barPercent = Math.min(100, (aqiData.aqi / 300) * 100);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Wind size={18} color={levelObj.color} />
        <Text style={styles.titleText}>{t.sections.airQuality}</Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>{aqiData.aqi}</Text>
        <View style={styles.labelCol}>
          <Text style={[styles.labelText, { color: levelObj.color }]}>
            {levelObj.label}
          </Text>
          <Text style={styles.descText}>{levelObj.desc}</Text>
        </View>
      </View>

      {/* AQI Progress Bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${barPercent}%`, backgroundColor: levelObj.color },
          ]}
        />
      </View>

      {/* Pollutant Breakdown Grid */}
      <View style={styles.pollutantsGrid}>
        <View style={styles.polItem}>
          <Text style={styles.polName}>PM 2.5</Text>
          <Text style={styles.polVal}>{aqiData.pm25} µg/m³</Text>
        </View>

        <View style={styles.polItem}>
          <Text style={styles.polName}>PM 10</Text>
          <Text style={styles.polVal}>{aqiData.pm10} µg/m³</Text>
        </View>

        <View style={styles.polItem}>
          <Text style={styles.polName}>O3</Text>
          <Text style={styles.polVal}>{aqiData.o3} ppb</Text>
        </View>

        <View style={styles.polItem}>
          <Text style={styles.polName}>NO2</Text>
          <Text style={styles.polVal}>{aqiData.no2} ppb</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 16,
  },
  labelCol: {
    flex: 1,
  },
  labelText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  polItem: {
    width: '23%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  polName: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  polVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
});
