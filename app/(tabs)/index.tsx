import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { WeatherHero } from '../../components/WeatherHero';
import { InsightCard } from '../../components/InsightCard';
import { HourlyStrip } from '../../components/HourlyStrip';
import { QuickStatsRow } from '../../components/QuickStatsRow';
import { DailyForecast } from '../../components/DailyForecast';
import { useWeather } from '../../hooks/useWeather';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../constants/i18n';

export default function HomeScreen() {
  const { activeCity, offlineMode, language, previewCondition } = useAppStore();
  const t = TRANSLATIONS[language];
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const {
    data: weather,
    isLoading,
    refetch,
  } = useWeather(activeCity.name, activeCity.lat, activeCity.lon, activeCity.id);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const conditionCode = previewCondition || weather?.conditionCode || 'PartlyCloudy';

  return (
    <AnimatedBackground 
      conditionCode={conditionCode} 
      tempC={weather?.tempC} 
      isHomeScreen={true}
      scrollY={scrollY}
    >
      <SafeAreaView style={styles.safeArea}>
        {offlineMode && (
          <View style={styles.offlineBanner}>
            <WifiOff size={14} color="#FF6B6B" />
            <Text style={styles.offlineText}>Offline mode — showing last cached data</Text>
          </View>
        )}

        {isLoading && !weather ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>{t.hero.refreshing}</Text>
          </View>
        ) : weather ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#FFFFFF"
                colors={['#56CCF2']}
              />
            }
          >
            {/* Glanceable Hero */}
            <WeatherHero
              weather={weather}
              onRefresh={handleRefresh}
              isRefreshing={refreshing}
            />

            {/* Smart Insight Banner */}
            <InsightCard weather={weather} />

            {/* 24-Hour Forecast Strip */}
            <HourlyStrip hourly={weather.hourly} />

            {/* Current Conditions Quick Stats */}
            <QuickStatsRow weather={weather} />

            {/* 7-Day Forecast */}
            <DailyForecast daily={weather.daily} />
          </ScrollView>
        ) : null}
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
    paddingBottom: 24,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  offlineText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
});
