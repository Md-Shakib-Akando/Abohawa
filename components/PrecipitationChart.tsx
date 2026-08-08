import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { HourlyForecast } from '../types/weather';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

const screenWidth = Dimensions.get('window').width - 64;

interface PrecipitationChartProps {
  hourly: HourlyForecast[];
}

export function PrecipitationChart({ hourly }: PrecipitationChartProps) {
  const { unitSystem, language } = useAppStore();
  const t = TRANSLATIONS[language];

  if (!hourly || hourly.length === 0) return null;

  const points = hourly.slice(0, 12); // Next 12 hours
  const temps = points.map(p => unitSystem === 'metric' ? p.tempC : p.tempF);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  const chartHeight = 120;
  const colWidth = screenWidth / points.length;

  // Build SVG Path string for Temperature Curve
  let pathD = '';
  points.forEach((p, idx) => {
    const temp = unitSystem === 'metric' ? p.tempC : p.tempF;
    const x = idx * colWidth + colWidth / 2;
    const y = chartHeight - 30 - ((temp - minTemp) / tempRange) * (chartHeight - 50);

    if (idx === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleText}>{t.sections.precipChart}</Text>

      <View style={styles.chartWrapper}>
        <Svg height={chartHeight + 30} width={screenWidth}>
          {/* Hourly Rain Bars & Temp Nodes */}
          {points.map((p, idx) => {
            const temp = unitSystem === 'metric' ? p.tempC : p.tempF;
            const x = idx * colWidth + colWidth / 2;
            const y = chartHeight - 30 - ((temp - minTemp) / tempRange) * (chartHeight - 50);
            const barHeight = (p.pop / 100) * 40;

            return (
              <React.Fragment key={idx}>
                {/* Rain Probability Bar */}
                {p.pop > 0 && (
                  <Rect
                    x={x - 6}
                    y={chartHeight - barHeight}
                    width="12"
                    height={barHeight}
                    fill="rgba(77, 150, 255, 0.35)"
                    rx="3"
                  />
                )}

                {/* Temp Label above point */}
                <SvgText
                  x={x}
                  y={y - 8}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {temp}°
                </SvgText>

                {/* Hour Label */}
                <SvgText
                  x={x}
                  y={chartHeight + 20}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {p.time.substring(0, 2)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Temperature Polyline */}
          <Path
            d={pathD}
            fill="none"
            stroke="#FFD93D"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
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
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
