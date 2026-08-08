import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Sunrise, Sunset } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface SunArcCardProps {
  sunrise: string;
  sunset: string;
  daylightHours: string;
}

export function SunArcCard({ sunrise, sunset, daylightHours }: SunArcCardProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  // Calculate current daylight progress
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  // Assume sunrise 5.5, sunset 18.5
  const progress = Math.min(1, Math.max(0, (currentHour - 5.5) / 13));

  const angle = Math.PI * progress;
  const sunX = 140 - 110 * Math.cos(angle);
  const sunY = 110 - 90 * Math.sin(angle);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Sunrise size={18} color="#FFD93D" />
        <Text style={styles.titleText}>{t.sections.sunArc}</Text>
      </View>

      {/* SVG Arc */}
      <View style={styles.arcContainer}>
        <Svg height="120" width="280" viewBox="0 0 280 120">
          {/* Dashed Arc */}
          <Path
            d="M 30 110 A 110 90 0 0 1 250 110"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          {/* Baseline */}
          <Path
            d="M 10 110 L 270 110"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />
          {/* Active Sun Dot */}
          {progress > 0 && progress < 1 && (
            <Circle cx={sunX} cy={sunY} r="8" fill="#FFD93D" />
          )}
        </Svg>
      </View>

      {/* Sunrise & Sunset Row */}
      <View style={styles.timeRow}>
        <View style={styles.timeCol}>
          <Sunrise size={16} color="#FFD93D" />
          <Text style={styles.timeLabel}>{t.stats.sunrise}</Text>
          <Text style={styles.timeVal}>{sunrise}</Text>
        </View>

        <Text style={styles.daylightText}>{t.stats.daylight}: {daylightHours}</Text>

        <View style={styles.timeCol}>
          <Sunset size={16} color="#FF9966" />
          <Text style={styles.timeLabel}>{t.stats.sunset}</Text>
          <Text style={styles.timeVal}>{sunset}</Text>
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
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  arcContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  timeCol: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  daylightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});
