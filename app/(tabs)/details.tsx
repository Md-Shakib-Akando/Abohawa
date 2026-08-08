import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text } from 'react-native';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { PrecipitationChart } from '../../components/PrecipitationChart';
import { UvGauge } from '../../components/UvGauge';
import { AqiCard } from '../../components/AqiCard';
import { SunArcCard } from '../../components/SunArcCard';
import { useWeather } from '../../hooks/useWeather';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../constants/i18n';
import { THEME } from '../../constants/theme';

export default function DetailsScreen() {
  const { activeCity, language, previewCondition } = useAppStore();
  const t = TRANSLATIONS[language];

  const { data: weather, isLoading } = useWeather(
    activeCity.name,
    activeCity.lat,
    activeCity.lon,
    activeCity.id
  );

  const conditionCode = previewCondition || weather?.conditionCode || 'PartlyCloudy';

  if (!weather) return null;

  const displayCityName = activeCity?.name || weather.city;

  return (
    <AnimatedBackground conditionCode={conditionCode} tempC={weather.tempC}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Title */}
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>{t.tabs.details} — {displayCityName}</Text>
          </View>

          {/* Interactive SVG Precipitation & Temperature Chart */}
          <PrecipitationChart hourly={weather.hourly} />

          {/* Air Quality Card */}
          <AqiCard aqiData={weather.aqi} />

          {/* UV Gauge Card */}
          <UvGauge uvIndex={weather.uvIndex} />

          {/* Sunrise / Sunset Solar Arc Card */}
          <SunArcCard
            sunrise={weather.sunrise}
            sunset={weather.sunset}
            daylightHours={weather.daylightHours}
          />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: THEME.spacing.md,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
