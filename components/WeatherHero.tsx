import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { WeatherData } from '../types/weather';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface WeatherHeroProps {
  weather: WeatherData;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function WeatherHero({ weather, onRefresh, isRefreshing }: WeatherHeroProps) {
  const { unitSystem, language, activeCity } = useAppStore();
  const t = TRANSLATIONS[language];

  const temp = unitSystem === 'metric' ? weather.tempC : weather.tempF;
  const feelsLike = unitSystem === 'metric' ? weather.feelsLikeC : weather.feelsLikeF;
  const maxTemp = unitSystem === 'metric' ? weather.tempMaxC : weather.tempMaxF;
  const minTemp = unitSystem === 'metric' ? weather.tempMinC : weather.tempMinF;
  const unitSymbol = unitSystem === 'metric' ? '°C' : '°F';

  const conditionTranslated = t.weatherConditions[weather.conditionCode] || weather.conditionText;

  // Last updated calculation
  const minsAgo = Math.max(0, Math.floor((Date.now() - weather.lastUpdated) / 60000));
  const timeAgoStr = minsAgo === 0 ? t.hero.justNow : `${minsAgo} ${t.hero.minsAgo}`;

  const displayCityName = activeCity?.name || weather.city;
  const displayCountryName = (activeCity?.country && activeCity.country !== 'World' && activeCity.country !== 'Local')
    ? activeCity.country
    : (weather.country && weather.country !== 'World' && weather.country !== 'Local' ? weather.country : '');

  return (
    <View style={styles.container}>
      {/* Top Bar / Location Header */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <MapPin size={20} color="#56CCF2" style={styles.pinIcon} />
          <Text style={styles.cityName}>{displayCityName}</Text>
          {displayCountryName ? (
            <Text style={styles.countryTag}>, {displayCountryName}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onRefresh}
          disabled={isRefreshing}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <RefreshCw
            size={18}
            color="#FFFFFF"
            style={isRefreshing ? styles.spinning : undefined}
          />
          <Text style={styles.timeAgoText}>{timeAgoStr}</Text>
        </TouchableOpacity>
      </View>

      {/* Severe Alert Banner if active */}
      {weather.alert && (
        <View style={styles.alertRibbon}>
          <AlertTriangle size={16} color="#FF6B6B" />
          <Text style={styles.alertText} numberOfLines={1}>
            {weather.alert.title}
          </Text>
        </View>
      )}

      {/* Main Glanceable Temp Display (96pt ultra light) */}
      <View style={styles.heroTempRow}>
        <Text style={styles.heroTempText}>{temp}</Text>
        <Text style={styles.heroUnitText}>{unitSymbol}</Text>
      </View>

      {/* Condition Description */}
      <Text style={styles.conditionText}>{conditionTranslated}</Text>

      {/* Stats Sub-row (Feels like, H/L range) */}
      <View style={styles.subStatsRow}>
        <Text style={styles.subStatText}>
          {t.hero.feelsLike} {feelsLike}°
        </Text>

        <Text style={styles.bulletDivider}>•</Text>

        <Text style={styles.subStatText}>
          {t.hero.high}: {maxTemp}°  {t.hero.low}: {minTemp}°
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: THEME.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 6,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countryTag: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '400',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  spinning: {
    opacity: 0.6,
  },
  timeAgoText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  alertRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: THEME.spacing.xs,
    width: '100%',
  },
  alertText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  heroTempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: THEME.spacing.xs,
  },
  heroTempText: {
    fontSize: THEME.typography.heroTemp.fontSize,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -3,
    includeFontPadding: false,
  },
  heroUnitText: {
    fontSize: 32,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 18,
    marginLeft: 2,
  },
  conditionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: -8,
    marginBottom: 6,
  },
  subStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  subStatText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  bulletDivider: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 8,
  },
});
