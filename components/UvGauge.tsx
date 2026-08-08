import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Sun } from 'lucide-react-native';
import { UV_LEVELS } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface UvGaugeProps {
  uvIndex: number;
}

export function UvGauge({ uvIndex }: UvGaugeProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  // Find level definition
  const levelObj = UV_LEVELS.find(l => uvIndex <= l.max) || UV_LEVELS[UV_LEVELS.length - 1];

  // Arc gauge calculation (semi circle radius 60)
  const percent = Math.min(1, Math.max(0, uvIndex / 11));
  const angle = Math.PI * percent; // 0 to PI
  const needleX = 80 - 65 * Math.cos(angle);
  const needleY = 80 - 65 * Math.sin(angle);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleRow}>
        <Sun size={18} color="#FF9800" />
        <Text style={styles.sectionTitle}>{t.sections.uvIndex}</Text>
      </View>

      <View style={styles.gaugeCenter}>
        <Svg height="100" width="160" viewBox="0 0 160 90">
          {/* Background Arc */}
          <Path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active Arc */}
          <Path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke={levelObj.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="204"
            strokeDashoffset={204 - 204 * percent}
          />
        </Svg>

        <View style={styles.valContainer}>
          <Text style={styles.uvValText}>{uvIndex}</Text>
          <Text style={[styles.uvLevelBadge, { color: levelObj.color }]}>
            {levelObj.label}
          </Text>
        </View>
      </View>

      <Text style={styles.tipText}>{levelObj.tip}</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  gaugeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  valContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  uvValText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uvLevelBadge: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: -4,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
});
